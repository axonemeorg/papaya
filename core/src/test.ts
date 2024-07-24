import { _getListProjectsQuery } from "api/actions/projects";

const main = async () => {

    const response = await _getListProjectsQuery()

    console.log('response:', response);
}

main();
