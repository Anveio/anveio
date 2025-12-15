FROM node:24-bookworm-slim

ARG BD_VERSION=0.29.0

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install beads (bd) CLI
RUN curl -L -o /tmp/beads.tar.gz \
      "https://github.com/steveyegge/beads/releases/download/v${BD_VERSION}/beads_${BD_VERSION}_linux_amd64.tar.gz" \
    && tar -xzf /tmp/beads.tar.gz -C /tmp \
    && mv /tmp/bd /usr/local/bin/bd \
    && chmod +x /usr/local/bin/bd \
    && rm /tmp/beads.tar.gz

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
      -o /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
      > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

# Install Vercel CLI globally
RUN npm install -g vercel

USER node
WORKDIR /workspaces
