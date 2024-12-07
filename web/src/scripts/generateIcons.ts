import fs from 'fs'
import path from 'path'

import data from '@/assets/icons.json'

interface Icon {
	name: string
	version: number
	popularity: number
	codepoint: number
	unsupported_families: string[]
	categories: string[]
	tags: string[]
	sizes_px: number[]
}

interface IconData {
	host: string
	asset_url_pattern: string
	families: string[]
	icons: Icon[]
}

function filterIcons(data: IconData) {
	return data.icons
		.filter((icon) => !icon.unsupported_families.includes('Material Icons'))
		.map((icon) => ({
			name: icon.name,
			popularity: icon.popularity,
			categories: icon.categories,
			tags: icon.tags,
		}))
}

function main() {
	const outputPath = path.resolve(path.join(__dirname, '../constants', 'icons.ts'))
	const filteredIcons = filterIcons(data)

	const outputContent = `export default ${JSON.stringify(filteredIcons, null, 2)};`

	// Write the filtered result to a new JSON file
	fs.writeFile(outputPath, outputContent, (err) => {
		if (err) {
			console.error('Error writing to file', err)
		} else {
			console.log('Filtered icons saved to filteredIcons.json')
		}
	})
}

main()
