#!/usr/bin/env node

import {Fetcher} from "generic-filehandle"
import { Command } from "commander";
import { InvalidArgumentError } from "commander"
import figlet from "figlet";
import fetch from 'node-fetch';
import { RemoteFile } from 'generic-filehandle';
import NCList from '@gmod/nclist';
import { exit } from "process";


function ParseInt(value: any) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

const program = new Command();
program
  .version("1.0.0")
  .description(
    `${figlet.textSync("JBrowse NCList")}\nA wrapper around gmod/nclist-js. It returns JSON for generating cross references to JBrowse features`)
  .requiredOption("-b, --baseurl  <value>", "Path to JBrowse Data Directory - base URL for resolving relative URLs")
  .requiredOption("-t, --template <value>", "URL Template")
  .requiredOption("-r, --refseq <value>", "The Sequence name")
  .requiredOption("-s, --start <integer>", "start position", ParseInt)
  .requiredOption("-e, --end <integer>", "end position", ParseInt)
  .option("-d, --displayname [string]", "jbrowse displayname fields", "alias")
  .option("-i, --seqid [string]", "the sequence name for the location of the features", "seq_id")
  .option("-n, --idname [string]", "the sequence identifier of the features", "name")
  .option("-v, --verbose", "For debugigng purposes")
  .parse(process.argv);

const options = program.opts();

if (options.verbose) {
  console.log("Options:")
  console.log(options)
}


// scott says make alias and name configurable
function encodeGene(feature: any) {
  var display_name: string = (Array.isArray(feature.get(options.displayname)))? feature.get(options.displayname)[0] : feature.get(options.displayname);
  var id_name: string = (Array.isArray(feature.get(options.idname)))? feature.get(options.idname)[0] : feature.get(options.idname);
  return {
    location: `${feature.get(options.seqid)}:${feature.get('start')}-${feature.get('end')}`,
    display_name: display_name,
    id: id_name
  };
}

;(async () => {
  const store = new NCList({
    baseUrl: options.baseurl,
    urlTemplate: options.template,
    readFile: (url: string) => new RemoteFile(url, {fetch: fetch as any as Fetcher}).readFile(),
  })
  var genes = []
  for await (const feature of store.getFeatures({
    refName: options.refseq,
    start: options.start,
    end: options.end,
  })) {
    genes.push(encodeGene(feature));
  }
  console.log(JSON.stringify(genes));
})();
