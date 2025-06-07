import ConfigService from "../support/ConfigService.js";
import Controller from "../support/Controller.js";

/**
 * Controller for managing Zisk configuration
 */
export default class ConfigController extends Controller {
  private configService: ConfigService;

  constructor() {
    super();
    this.configService = ConfigService.getInstance();
  }

  /**
   * Get the current configuration
   * @returns The current configuration
   */
  public getConfig(): any {
    return this.configService.getConfig();
  }

  /**
   * Update the configuration
   * @param newConfig The new configuration
   */
  public async updateConfig(newConfig: any): Promise<void> {
    await this.configService.updateConfig(newConfig);
  }

  /**
   * Restart the server
   */
  public restartServer(): void {
    // Wait a moment to ensure any response is sent
    setTimeout(() => {
      console.log('Restarting server...');
      process.exit(0);
    }, 1000);
  }
}
