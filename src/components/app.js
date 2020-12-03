
import { html } from 'lit-html';
import { form } from './form';

// Utility per leggere il valore di una chiave dal localStorage
// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
const lsget = (key) => localStorage.getItem(key)

// Operatore ternario in fase di assegnazione valore per una referenza:
// se la condizione fornita è vera assegna un valore, altrimenti ne assegna un altro
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
let victim = lsget('victim') ? lsget('victim') : '';
let students = lsget('students') ? lsget('students').split(',') : [];
let backup = lsget('backup') ? lsget('backup').split(',') : [];


const sendUpdate = () => {
  const ce = new CustomEvent('update', {
    bubbles: true,
  });

  document.dispatchEvent(ce);
}

document.addEventListener('add-students', (event) => {
  console.log(event.detail);
  students = event.detail;

  // Metodo rapido per creare un clone di un array sfruttando l'operatore spread
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  backup = [...students];

  // .setItem per scrivere il valore di una chiave nel local storage
  // // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
  localStorage.setItem('students', students.join(','));
  localStorage.setItem('backup', backup.join(','));

  sendUpdate();
});

const selectionHandler = () => {
  // Generare un numero casuale tra zero e il numero di elementi in un array
  // https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  // https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
  const rand = Math.floor(Math.random() * students.length);
  victim = students[rand];
  students = students.filter((student) => student !== victim);

  localStorage.setItem('students', students.join(','));
  localStorage.setItem('victim', victim);

  sendUpdate();
}

const resetHandler = () => {
  victim = '';
  students = [...backup];
  sendUpdate();
}

const victimTmpl = () => html`<hr>
<h2>${victim}</h2>`;

const actionsTmpl = () => html`
  <div id="actions">
    <button class="btn btn-danger" @click=${selectionHandler}>
      Select the vittimah
    </button>
    <button class="btn" @click=${resetHandler}>
      Reset
    </button>
  
    ${victim.length ? victimTmpl() : html``}
  </div>
`;

const app = () => html`<section id="app">
  <h1>Student picker for really bad torture</h1>
  ${form()}
  <div id="view">
    <ul>
      ${students.map((student) => html`<li>${student}</li>`)}
    </ul>
  </div>

  ${students.length ? actionsTmpl() : html``}

</section>`;
// In questo template si utilizza l'operatore ternario per generare porzioni
// di marcatura in maniera condizionale
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator

export {
  app
}