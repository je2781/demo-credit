import {api} from '../api';
import { Handler, Context } from "aws-lambda";
import ServerlessHttp from "serverless-http";

// Export a Lambda function handler
export const handler: Handler = async (event: any, context: Context) => {
    // Create the Serverless Http handler and pass the Express app
    const serverlessHandler = ServerlessHttp(api);
    // Call the Serverless Http handler to process the Lambda event
    return serverlessHandler(event, context);
  };
  
