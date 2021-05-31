#!/bin/bash

set

docker build -t newbor_apartment_tracker-nonprod-four_room_apartments .

docker tag newbor_apartment_tracker-nonprod-four_room_apartments:latest 409948879486.dkr.ecr.eu-north-1.amazonaws.com/newbor_tracker:latest

docker push 409948879486.dkr.ecr.eu-north-1.amazonaws.com/newbor_tracker:latest

yarn deploy
