# How to
### Prerequisites:
* aws-cli
* cfn-lint
* node
* Be authed to AWS CLI

1. For the first deploy you will need to init the deploy bucket
```
./deploy.sh init
```
2. Deploy the simple example (bff only, no SQS)
```
./deploy.sh simple
```
3. Deploy the SQS example
```
./deploy.sh sqs
```
