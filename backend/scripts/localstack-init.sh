echo "🎲 Criando tabela TB_FULL_XML_HML no DynamoDB..."

awslocal dynamodb create-table \
  --table-name TB_FULL_XML_HML \
  --attribute-definitions \
    AttributeName=NF_KEY,AttributeType=S \
    AttributeName=NF_TYPE,AttributeType=S \
    AttributeName=YEAR_MONTH,AttributeType=S \
  --key-schema \
    AttributeName=NF_KEY,KeyType=HASH \
    AttributeName=NF_TYPE,KeyType=RANGE \
  --global-secondary-indexes '[
      {
        "IndexName": "YEAR_MONTH-index",
        "KeySchema": [
          {
            "AttributeName": "YEAR_MONTH",
            "KeyType": "HASH"
          }
        ],
        "Projection": {
          "ProjectionType": "ALL"
        }
      }
    ]' \
  --billing-mode PAY_PER_REQUEST \
  --region sa-east-1 > /dev/null