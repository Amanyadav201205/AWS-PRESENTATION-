import { allDomains, allPillars, drStrategies } from '../src/data/index';
import { theoreticalFoundations } from '../src/data/theoreticalFoundations';
import { clientWorkloads } from '../src/data/clientWorkloads';
import { pillarDetails } from '../src/data/pillarsData';
import { moduleScripts } from '../src/data/deck/moduleScripts';
import { moduleTables } from '../src/data/deck/moduleTables';
import { theorySlides, titleSlide, agendaSlide, closingSlide } from '../src/data/deck/theorySlides';
import * as fs from 'fs';

const fullData = {
  allDomains,
  allPillars,
  drStrategies,
  theoreticalFoundations,
  clientWorkloads,
  pillarDetails,
  moduleScripts,
  moduleTables,
  theorySlides,
  titleSlide,
  agendaSlide,
  closingSlide
};

fs.writeFileSync('scratch/all_presentation_data.json', JSON.stringify(fullData, null, 2));
console.log('Successfully exported all_presentation_data.json. Size:', fs.statSync('scratch/all_presentation_data.json').size, 'bytes');
