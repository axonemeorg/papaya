import fs from 'fs';
import yaml from 'js-yaml';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration schema with const assertion for type safety
export const CONFIG_SCHEMA = {
  couchdb: {
    url: '',
    port: 0,
    admin_user: '',
    admin_pass: '',
  },
  auth: {
    access_token_secret: '',
    refresh_token_secret: '',
    access_token_hmac_kid: '',
  },
  server: {
    port: 0,
    name: '',
  },
} as const;

// Create types from the schema
export type ConfigSchema = typeof CONFIG_SCHEMA;
export type ConfigPath = keyof ConfigSchema;
export type NestedConfigPath<T extends ConfigPath> = `${T}.${keyof ConfigSchema[T] & string}`;
export type ConfigValue<T extends ConfigPath | NestedConfigPath<ConfigPath>> =
  T extends keyof ConfigSchema
  ? ConfigSchema[T]
  : T extends `${infer U}.${infer V}`
  ? U extends keyof ConfigSchema
  ? V extends keyof ConfigSchema[U]
  ? ConfigSchema[U][V]
  : never
  : never
  : never;

// Configuration interface
export type ZiskConfig = {
  [K in keyof typeof CONFIG_SCHEMA]: {
    [P in keyof typeof CONFIG_SCHEMA[K]]: typeof CONFIG_SCHEMA[K][P] extends string
    ? string
    : typeof CONFIG_SCHEMA[K][P] extends number
    ? number
    : typeof CONFIG_SCHEMA[K][P] extends boolean
    ? boolean
    : unknown;
  };
};

import nano from 'nano';

/**
 * Singleton class for managing Zisk configuration
 */
export default class ConfigService {
  private static instance: ConfigService;
  private config: ZiskConfig;
  private configDbName = 'zisk_config';
  private configDocId = 'current';
  private couchDbConnection: nano.ServerScope | null = null;
  private isInitialized = false;

  /**
   * Private constructor to prevent direct instantiation
   */
  private constructor() {
    // Load initial configuration from files
    this.config = this.loadConfigFromFiles();
  }

  /**
   * Get the singleton instance of ConfigService
   * @returns The singleton instance
   */
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Initialize the configuration service with CouchDB connection
   * This should be called after the initial configuration is loaded
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Connect to CouchDB using admin credentials from the file-based config
      const url = this.get<string>('couchdb.url');
      const adminUser = this.get<string>('couchdb.admin_user');
      const adminPass = this.get<string>('couchdb.admin_pass');

      this.couchDbConnection = nano(`http://${adminUser}:${adminPass}@${url.split('//')[1]}`);

      // Ensure the config database exists
      await this.ensureConfigDbExists();

      // Try to load configuration from the database
      try {
        const dbConfig = await this.loadConfigFromDb();
        if (dbConfig) {
          // Merge with file-based config, with DB config taking precedence
          this.config = this.deepMerge(this.config, dbConfig) as ZiskConfig;
          console.log('Loaded configuration from database');
        }
      } catch (error) {
        console.error('Failed to load configuration from database:', error);
        // If loading fails, save the current configuration to the database
        await this.saveConfigToDb(this.config);
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize ConfigService:', error);
    }
  }

  /**
   * Ensure the configuration database exists
   */
  private async ensureConfigDbExists(): Promise<void> {
    if (!this.couchDbConnection) {
      throw new Error('CouchDB connection not initialized');
    }

    try {
      // Check if the database exists
      const dbList = await this.couchDbConnection.db.list();

      if (!dbList.includes(this.configDbName)) {
        // Create the database if it doesn't exist
        await this.couchDbConnection.db.create(this.configDbName);
        console.log(`Created ${this.configDbName} database`);
      }
    } catch (error) {
      console.error('Error ensuring config database exists:', error);
      throw error;
    }
  }

  /**
   * Save configuration to the database
   * @param config The configuration to save
   */
  private async saveConfigToDb(config: ZiskConfig): Promise<void> {
    if (!this.couchDbConnection) {
      throw new Error('CouchDB connection not initialized');
    }

    const db = this.couchDbConnection.db.use(this.configDbName);

    try {
      // Check if the document exists
      try {
        const doc = await db.get(this.configDocId);
        // Update the existing document
        await db.insert({
          ...doc,
          ...config
        }, this.configDocId);
      } catch (error) {
        // Document doesn't exist, create it
        await db.insert({
          _id: this.configDocId,
          ...config
        });
      }

      console.log('Configuration saved to database');
    } catch (error) {
      console.error('Failed to save configuration to database:', error);
      throw error;
    }
  }

  /**
   * Load configuration from the database
   * @returns The configuration from the database
   */
  private async loadConfigFromDb(): Promise<ZiskConfig | null> {
    if (!this.couchDbConnection) {
      throw new Error('CouchDB connection not initialized');
    }

    const db = this.couchDbConnection.db.use(this.configDbName);

    try {
      const doc = await db.get(this.configDocId);
      // Remove CouchDB specific fields
      const { _id, _rev, ...config } = doc;
      return config as ZiskConfig;
    } catch (error) {
      console.error('Failed to load configuration from database:', error);
      return null;
    }
  }

  /**
   * Load configuration from YAML files
   * @returns The merged configuration
   */
  private loadConfigFromFiles(): ZiskConfig {
    // Check for Docker environment first
    const dockerConfigPath = '/etc/zisk/config.yaml';
    if (fs.existsSync(dockerConfigPath)) {
      try {
        const dockerConfigContent = fs.readFileSync(dockerConfigPath, 'utf8');
        const dockerConfig = yaml.load(dockerConfigContent) as ZiskConfig;
        console.log('Loaded configuration from Docker environment');
        return dockerConfig;
      } catch (error) {
        console.error('Failed to load Docker config:', error);
      }
    }

    // Try to load local config
    let localConfig = {};
    try {
      const localConfigPath = 'local.yaml'
      if (fs.existsSync(localConfigPath)) {
        const localConfigContent = fs.readFileSync(localConfigPath, 'utf8');
        localConfig = yaml.load(localConfigContent) || {};
      }
    } catch (error) {
      console.warn('No local config found or error loading it:', error);
    }

    return localConfig as ZiskConfig;
  }

  /**
   * Deep merge two objects
   * @param target The target object
   * @param source The source object
   * @returns The merged object
   */
  private deepMerge(target: any, source: any): any {
    const output = { ...target };

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;
  }

  /**
   * Check if a value is an object
   * @param item The value to check
   * @returns True if the value is an object, false otherwise
   */
  private isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  /**
   * Get a configuration value by key
   * @param key The key to get
   * @returns The configuration value
   */
  public get<T>(key: string): T {
    return this.getNestedProperty(this.config, key) as T;
  }

  /**
   * Get a nested property from an object using dot notation
   * @param obj The object to get the property from
   * @param path The path to the property using dot notation
   * @returns The property value
   */
  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : undefined;
    }, obj);
  }

  /**
   * Get the entire configuration
   * @returns The entire configuration
   */
  public getConfig(): ZiskConfig {
    return { ...this.config };
  }

  /**
   * Update the configuration
   * @param newConfig The new configuration
   */
  public async updateConfig(newConfig: Partial<ZiskConfig>): Promise<void> {
    // Update in-memory configuration
    this.config = this.deepMerge(this.config, newConfig) as ZiskConfig;

    // Save to database if initialized
    if (this.isInitialized) {
      await this.saveConfigToDb(this.config);
    }
  }

  /**
   * Save the current configuration to the database
   * This is used to persist configuration changes
   */
  public async saveConfig(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('ConfigService not initialized');
    }

    await this.saveConfigToDb(this.config);
  }
}

// Export configuration getters for backward compatibility
export const getConfig = (): ZiskConfig => ConfigService.getInstance().getConfig();
export const ZISK_COUCHDB_URL = (): string => ConfigService.getInstance().get<string>('couchdb.url');
export const ZISK_COUCHDB_ADMIN_USER = (): string => ConfigService.getInstance().get<string>('couchdb.admin_user');
export const ZISK_COUCHDB_ADMIN_PASS = (): string => ConfigService.getInstance().get<string>('couchdb.admin_pass');
export const AUTH_REFRESH_TOKEN_SECRET = (): string => ConfigService.getInstance().get<string>('auth.refresh_token_secret');
export const AUTH_ACCESS_TOKEN_SECRET = (): string => ConfigService.getInstance().get<string>('auth.access_token_secret');
export const AUTH_ACCESS_TOKEN_HMAC_KID = (): string => ConfigService.getInstance().get<string>('auth.access_token_hmac_kid');
export const ZISK_SERVER_PORT = (): number => ConfigService.getInstance().get<number>('server.port');
export const SERVER_NAME = (): string => ConfigService.getInstance().get<string>('server.name');
export const NODE_ENV = (): string | undefined => process.env.NODE_ENV;
