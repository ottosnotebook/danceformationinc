FROM ruby:2.3

RUN apt-get update && \
    apt-get -y install nodejs && \
    gem install middleman