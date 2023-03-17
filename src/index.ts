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
  .option("-v, --verbose", "For debugigng purposes")
  .parse(process.argv);

const options = program.opts();

if (options.verbose) {
  console.log("Options:")
  console.log(options)
}

function encodeGene(feature: any) {
  var display_name: string = (Array.isArray(feature.get('alias')))? feature.get('alias')[0] : feature.get('alias');
  return {
    location: `${feature.get('seq_id')}:${feature.get('start')}-${feature.get('end')}`,
    display_name: display_name,
    id: feature.get('name')
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
