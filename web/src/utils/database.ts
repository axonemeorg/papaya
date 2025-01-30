import { ZiskMeta, ZiskSettings } from '@/types/schema'
import { generateGenericUniqueId } from './id'

export const makeDefaultZiskSettings = (): ZiskSettings => {
	return {
		appearance: {
			// theme: 'DARK',
			// animations: 'NORMAL',
			menuExpanded: true,
		},
		server: {
			serverType: 'NONE',
		},
		syncingStrategy: {
			strategyType: 'LOCAL',
		},
	}
}

export const makeDefaultZiskMeta = (): ZiskMeta => {
	return {
		_id: generateGenericUniqueId(),
		activeJournalId: null,
		type: 'ZISK_META',
		settings: makeDefaultZiskSettings(),
		createdAt: new Date().toISOString(),
	}
}

export const dbNameToUsername = (prefixedHexName: string) => {
	return Buffer.from(prefixedHexName.replace('userdb-', ''), 'hex').toString('utf8');
}

export const usernameToDbName = (name: string) => {
	return 'userdb-' + Buffer.from(name).toString('hex');
}

export const getUrlPartsFromCouchDbConnectionString = (couchDbConnectionString: string) => {
    try {
        const parsedUrl = new URL(couchDbConnectionString);

        const protocol = parsedUrl.protocol // includes ':' at the end
        const user = parsedUrl.username || null
    	const password = parsedUrl.password || null
        const hostname = parsedUrl.hostname
        const port = parsedUrl.port || null
        const database = parsedUrl.pathname.replace(/^\//, '') || null
        
		return {
			url: `${protocol}//${hostname}:${port}/${database}`,
			user,
			password,
		}

    } catch (_error: any) {
        throw new Error("Invalid CouchDB connection string");
    }
}

export const getBasicAuthHeader = (username: string, password: string) => {

	const hash = `${username}:${password}`
	return `Basic ${btoa(hash)}`
}

export const testCouchDbConnection = async (couchDbConnectionString: string): Promise<boolean> => {
	const { url, user, password } = getUrlPartsFromCouchDbConnectionString(couchDbConnectionString)

	if (!user || !password || !url) {
		return false
	}

	let response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': getBasicAuthHeader(user, password),
				'Content-Type': 'application/json'
			}
		})
	} catch {
		return false
	}

	return Boolean(response?.ok)
}
