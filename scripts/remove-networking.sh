# Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
source env.sh
echo "Disassociating route table"
DISASSOCIATION=$(aws ec2 disassociate-route-table \
  --association-id ${ROUTE_ASSOCIATION_ID})

echo "Deleting route table"
TABLE=$(aws ec2 delete-route-table \
  --route-table-id ${ROUTE_TABLE_ID})

echo "Deleting NAT Gateway"
NAT_GATEWAY=$(aws ec2 delete-nat-gateway \
  --nat-gateway-id ${NAT_GATEWAY_ID})

echo "Sleeping for EIP disassociation"
sleep 120

echo "Releasing Elastic IP"
ELASTIC_IP=$(aws ec2 release-address \
  --allocation-id ${ALLOCATION_ID})

echo "Networking resources deleted!"
