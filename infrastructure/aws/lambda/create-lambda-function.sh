#!/bin/bash

set -e
##Check if enough arguements are passed
if [ $# -lt 11 ]; then
  echo 1>&2 "$0: Stack name not provided"
  exit 2
elif [ $# -gt 11 ]; then
  echo 1>&2 "$0: Too many Arguments"
  exit 2
fi

LambdaRole=$1
s3BucketName=$2
S3FileName=$3
LambdaFunctionName=$4
SNSTopicName=$5
SNSDisplayName=$6
DynamodbTableName=$7
ColumnName=$8
IdDataType=$9
ReadCU=$10
WriteCU=$11


# add stack name to the security group
#sed -i "s/STACK_NAME/$1/" ec2-parameters.json

##Creating Stack
aws cloudformation create-stack --stack-name "$1" --template-body file://lambda-creation.yml --parameters ParameterKey=LambdaRole,ParameterValue=$LambdaRole ParameterKey=s3BucketName,ParameterValue=$s3BucketName ParameterKey=S3FileName,ParameterValue=$S3FileName ParameterKey=LambdaFunctionName,ParameterValue=$LambdaFunctionName ParameterKey=SNSTopicName,ParameterValue=$SNSTopicName ParameterKey=SNSDisplayName,ParameterValue=$SNSDisplayName ParameterKey=DynamodbTableName,ParameterValue=$DynamodbTableName ParameterKey=ColumnName,ParameterValue=$ColumnName ParameterKey=IdDataType,ParameterValue=$IdDataType ParameterKey=ReadCU,ParameterValue=$ReadCU ParameterKey=WriteCU,ParameterValue=$WriteCU --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name $1

echo "stack $1 is created" 