FROM node:24-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git ttfautohint \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/iosevka
COPY IOSEVKA_VERSION /tmp/IOSEVKA_VERSION
RUN version="$(tr -d '[:space:]' < /tmp/IOSEVKA_VERSION)" \
    && test -n "$version" \
    && curl --fail --location --retry 3 \
       "https://codeload.github.com/be5invis/Iosevka/tar.gz/${version}" \
       --output /tmp/iosevka.tar.gz \
    && tar -xzf /tmp/iosevka.tar.gz --strip-components=1 \
    && rm /tmp/iosevka.tar.gz \
    && npm ci --no-audit --no-fund

COPY docker/build.mjs ./comfy-code-build.mjs
ENTRYPOINT ["node", "/opt/iosevka/comfy-code-build.mjs"]
CMD ["preview"]
