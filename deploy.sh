#!/bin/bash

set -e

#docker rmi newbor_apartment_tracker-nonprod-four_room_apartments 409948879486.dkr.ecr.eu-north-1.amazonaws.com/newbor_tracker -f

docker login

aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 409948879486.dkr.ecr.eu-north-1.amazonaws.com

docker build -t newbor_apartment_tracker-nonprod-four_room_apartments .

docker tag newbor_apartment_tracker-nonprod-four_room_apartments:latest 409948879486.dkr.ecr.eu-north-1.amazonaws.com/newbor_tracker:latest

docker push 409948879486.dkr.ecr.eu-north-1.amazonaws.com/newbor_tracker:latest

#yarn deploy
