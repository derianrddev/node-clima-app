const inquirer = require('inquirer');
const colors = require('colors');

const preguntas = [
  {
    type: 'list',
    name: 'opcion',
    message: '¿Qué desea hacer?',
    choices: [
      {
        value: '1',
        name: `${ '1.'.blue } Buscar ciudad`
      },
      {
        value: '2',
        name: `${ '2.'.blue } Historial`
      },
      {
        value: '0',
        name: `${ '0.'.blue } Salir`
      }
    ]
  }
]

const menu = async() => {
  console.clear();
  console.log('============================='.green)
  console.log('    Seleccione una opción')
  console.log('=============================\n'.green)

  const { opcion } = await inquirer.prompt(preguntas);

  return opcion;
}

const pausa = async() => {
  const pregunta = [
    {
      type: 'input',
      name: 'enter',
      message: `Presione ${ 'ENTER'.blue } para continuar`
    },
  ]
  console.log('');
  await inquirer.prompt(pregunta);
}

const leerInput = async( message ) => {
  const pregunta = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate( value ) {
        if ( value.length === 0) {
          return 'Por favor ingrese un valor';
        }
        return true;
      }
    }
  ]
  console.log('');
  const { desc } = await inquirer.prompt(pregunta);
  return desc;
}

const listarLugares = async( lugares = [] ) => {
  const choices = lugares.map( ( lugar, indice ) => {
    return {
      value: lugar.id,
      name: `${ colors.blue( indice + 1 ) }${ '.'.blue } ${ lugar.nombre }`
    }
  });

  choices.unshift({
    value: '0',
    name: `${ '0.'.blue } Cancelar`
  })

  const pregunta = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione la ciudad:',
      choices
    }
  ]

  console.log('');
  const { id } = await inquirer.prompt(pregunta);
  return id;
}

const confirmar = async( mensaje ) => {
  const pregunta = [
    {
      type: 'confirm',
      name: 'ok',
      mensaje
    }
  ]

  const { ok } = await inquirer.prompt(pregunta);
  return ok;
}

const mostrarListadoChecklist = async( tareas = [] ) => {
  const choices = tareas.map( ( tarea, indice ) => {
    return {
      value: tarea.id,
      name: `${ colors.blue( indice + 1 ) }${ '.'.blue } ${ tarea.desc }`,
      checked: ( tarea.completadoEn ) ? true : false
    }
  });

  const pregunta = [
    {
      type: 'checkbox',
      name: 'ids',
      message: 'Seleccione',
      choices
    }
  ]

  console.log('');
  const { ids } = await inquirer.prompt(pregunta);
  return ids;
}

module.exports = {
  menu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoChecklist
}