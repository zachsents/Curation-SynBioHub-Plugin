FROM python:3.10

# use same shell for each run command to help with installation
SHELL ["/bin/bash", "--login", "-c"]

# install NVM and Node 16
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
RUN nvm install 16

# move into work dir
WORKDIR /curation-app

# copy over app files
COPY . .

# install Node deps
RUN npm install

# setup & build frontend
RUN cd run-form && npm install && npx vite build

# clone in SYNBICT
RUN git clone https://github.com/SD2E/SYNBICT

# install deps for SYNBICT
RUN python SYNBICT/setup.py install

ENTRYPOINT npm start