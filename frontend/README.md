# Wine Data Lake (React Frontend)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run deploy`

This command can be configured to deploy the project. The example provided deploys to an AWS S3 bucket named "winedatalake." To configure, open package.json and replace "winedatalake" with the name of your own AWS S3 bucket. It
should look something like this:
`"deploy": "aws s3 sync build/ s3://[BUCKETNAME]”`

# Deployment w/ AWS S3

1. **Build the React Project**:
    1. Clone the project.
    2. Create an Auth0 *Single-Page Web Application* and note the domain and client ID; input these variables into the Auth0 configuration segment of index.js. https://auth0.com/docs/quickstart/spa/react/01-login
    4. Run `npm install` to install the relevant dependencies.
    5. Build the project by typing `npm run build` or `react-scripts build`.
    6. A new folder (build/) should appear - this contains the compiled, static project.
2. **Setup an S3 Web Hosting Bucket**:
    1. Log into your AWS account and navigate to the S3 service.
    2. Create a public S3 bucket named [BUCKETNAME].
    3. Follow the setup instructions here: https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html
    4. Confirm that the S3 bucket is configured for “Static Web Hosting” and set the starting point to be “index.html”.
    5. Confirm that the S3 bucket's policy has been configured appropriately. 
4. **Configure the AWS CLI Tools**:
    1. Follow the instructions here and install the command line
       tools: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html
    2. In the terminal, confirm that AWS Cli is configured appropriately by typing `aws s3 ls` (you should see your
       buckets)
5. **Deploy the App**:
    1. Use the command `aws s3 sync build/ s3://[BUCKETNAME]` to deploy the app on S3.
    2. You can open the application up at the URL specified for the index.html folder.
    3. S3 isn't https-enabled and Auth0 requires https. So, we need to use AWS Cloud Front.
6. **Deploy CloudFront Distrubution**:
    2. Create a CloudFront distribution. 
    3. Set the domain and object origin. 
    4. Enable the distribution. 
    5. The URL of the CF distribution should be added to the callback configuration of Auth0. 
    6. The website should now be available at this address. 

# Deployment w/ Google App Engine

1. **Build the React Project**:
   1. Clone the project. 
   2. Create an Auth0 *Single-Page Web Application* and note the domain and client ID; input these variables into the Auth0 configuration segment of index.js. https://auth0.com/docs/quickstart/spa/react/01-login
   3. Confirm that the project contains an 'app.yaml' file. This file contains the instructions for how App Engine will
       build the application.
   4. Run `npm install` to install the relevant dependencies.
   5. Build the project by typing `npm run build` or `react-scripts build`.
   6. A new folder (build/) should appear - this contains the compiled, static project.
2. **Setup a GCloud Project**:
    1. Create a project.
    2. Enable App Engine and the Cloud Build API.
3. **Install the GCloud CLI tools**:
    1. Follow the instructions here: https://cloud.google.com/sdk/docs/install
    2. If necessary, authenticate: `gcloud auth application-default login`
4. In the terminal, initiate a GCloud project with `gcloud init` and follow the prompts to connect your App Engine project.
5. Once setup is complete, type `gcloud app deploy` and follow the prompts.
6. Type `gcloud app browse` to view the deployed app.
7. The URL of the deployed app should be added to the callback configuration of Auth0.

## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
