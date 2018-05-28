# dat-pub
Lightweight HTTP service for discovering dats

## Goals

- Discovering other people's dats through a centralized service
- Super basic HTTP API
- People's dat information is stored in a dat so that it will be preserved even if the service goes down
- A way to filter by application type

## HTTP API

### `GET /`

Get the DAT URL that has the discovery information

### `POST /  {url, application}`

Add your dat URL for the given `application`.

Requires you to add a file to your dat at `/.well-known/dat-pubs/{service dat key}.json` that points back to this discovery service to make sure you're the owner.

The file is a JSON blob that will be copied to the discovery service and can be used by the application for filtering.

Invoking this when the URL is already present will update the file contents.

## Folder structure

`/{application}/{dat key}.json`

Each application gets their own top-level folder to make filtering easy on the client-side. Each file in the folder is the public key of a dat that's advertising itself. The contents of the file are supplied by the owner of the dat being advertised and can be used for filtering or for displaying information about the dat's contents.
