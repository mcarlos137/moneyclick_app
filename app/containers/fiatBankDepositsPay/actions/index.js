import {
} from "../../../constants/action-types";
import httpRequest from '../../../tools/httpRequest';



function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.status);
  }
  return response;
}