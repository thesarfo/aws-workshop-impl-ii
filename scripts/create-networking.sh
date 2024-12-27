# Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0
source env.sh
echo "Fetching VPC Id"
VPC_ID=$(aws ec2 describe-security-groups \
  --group-ids ${SECURITY_GROUP_ID} \
  --query 'SecurityGroups[0].VpcId' \
  --output text)

echo "Fetching subnet Id"
SUBNET_ID=$(aws ec2 describe-subnets \
  --filters '[
    {
      "Name": "vpc-id",
      "Values": ["'${VPC_ID}'"]
    }
  ]' \
  --query 'Subnets[0].SubnetId' \
  --output text)

echo "Creating Elastic IP address"
ELASTIC_IP_ID=$(aws ec2 allocate-address \
  --domain vpc \
  --query 'AllocationId' \
  --output text)

echo "Creating NAT Gateway"
NAT_GATEWAY_ID=$(aws ec2 create-nat-gateway \
  --subnet-id ${SUBNET_ID} \
  --allocation-id ${ELASTIC_IP_ID} \
  --query 'NatGateway.NatGatewayId' \
  --output text)

echo "Waiting for NAT Gateway to be ready..."
aws ec2 wait nat-gateway-available \
  --nat-gateway-ids ${NAT_GATEWAY_ID}

echo "Creating private subnet"
PRIVATE_SUBNET_ID=$(aws ec2 create-subnet \
  --vpc-id ${VPC_ID} \
  --cidr-block '172.31.96.0/24' \
  --query 'Subnet.SubnetId' \
  --output text)

echo "Creating route table"
ROUTE_TABLE_ID=$(aws ec2 create-route-table \
  --vpc-id ${VPC_ID} \
  --query 'RouteTable.RouteTableId' \
  --output text)

echo "Creating route"
ROUTE=$(aws ec2 create-route \
  --destination-cidr-block 0.0.0.0/0 \
  --route-table-id ${ROUTE_TABLE_ID} \
  --nat-gateway-id ${NAT_GATEWAY_ID})

echo "Associating route table with subnet"
ASSOCIATION=$(aws ec2 associate-route-table \
  --route-table-id ${ROUTE_TABLE_ID} \
  --subnet-id ${PRIVATE_SUBNET_ID} \
  --query 'AssociationId' \
  --output text)

echo "Networking resources created!"
echo "export ROUTE_ASSOCIATION_ID=${ASSOCIATION}" >> env.sh
echo "export ROUTE_TABLE_ID=${ROUTE_TABLE_ID}" >> env.sh
echo "export SUBNET_ID=${PRIVATE_SUBNET_ID}" >> env.sh
echo "export NAT_GATEWAY_ID=${NAT_GATEWAY_ID}" >> env.sh
echo "export ALLOCATION_ID=${ELASTIC_IP_ID}" >> env.sh
