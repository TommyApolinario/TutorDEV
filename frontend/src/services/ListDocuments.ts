import axios from "axios";
import apiRoutes from "../routes/routesDefinitions";

const ListDocuments = async (): Promise<Response> => {

  const response = await axios
    .get(apiRoutes.listdocuments)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });

  return response;
};

export default ListDocuments;
