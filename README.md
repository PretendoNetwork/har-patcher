# HAR Patcher
Simple patcher to fix broken HARs made by mitmproxy (and maybe others)

# Usage
- Install [Node](https://nodejs.org/)
- `node patch --input 'input.har' --output 'output.har'`

If no output is specified, the input is overwritten

```
Options:
  -i, --input <path>   Input HAR path (required)
  -o, --output <path>  Output HAR path (optional)
  -h, --help           display help for command
```