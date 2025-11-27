resource "aws_security_group" "food_ordering_client_deploy_server_sg" {
  name        = "food_ordering_client_deploy_server_sg"
  description = "Food Ordering Application Client-deploy Security Group"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Food Ordering Application Client-Deploy Server"
  }
}

resource "aws_instance" "food_ordering_client_deploy_server" {
  ami = var.ami
  subnet_id = data.aws_subnet.default.id
  vpc_security_group_ids = [aws_security_group.food_ordering_client_deploy_server_sg.id]
  instance_type = var.instance_type
  key_name = var.key_name
  tags = {
    Name = "Food Ordering Application Client-Deploy Server"
  }
}
