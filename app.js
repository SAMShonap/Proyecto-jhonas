
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 

cargarEventListeners();

function cargarEventListeners() {

     listaCursos.addEventListener('click', agregarCurso);

     carrito.addEventListener('click', eliminarCurso);


     vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

}

function agregarCurso(e) {
    e.preventDefault();

    if(e.target.classList.contains('agregar-carrito')) {
         const curso = e.target.parentElement.parentElement;

         leerDatosCurso(curso);
    }
}

function leerDatosCurso(curso) {
    const infoCurso = {
         imagen: curso.querySelector('img').src,
         titulo: curso.querySelector('h4').textContent,
         precio: curso.querySelector('.precio span').textContent,
         id: curso.querySelector('a').getAttribute('data-id'), 
         cantidad: 1
    }


    if( articulosCarrito.some( curso => curso.id === infoCurso.id ) ) { 
         const cursos = articulosCarrito.map( curso => {
              if( curso.id === infoCurso.id ) {
                   curso.cantidad++;
                    return curso;
               } else {
                    return curso;
            }
         })
         articulosCarrito = [...cursos];
    }  else {
         articulosCarrito = [...articulosCarrito, infoCurso];
    }

  
    carritoHTML();
}


function eliminarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains('borrar-curso') ) {

         const cursoId = e.target.getAttribute('data-id')

         articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

         carritoHTML();
    }
}

function carritoHTML() {

    vaciarCarrito();

    articulosCarrito.forEach(curso => {
         const row = document.createElement('tr');
         row.innerHTML = `
              <td>  
                   <img src="${curso.imagen}" width=100>
              </td>
              <td>${curso.titulo}</td>
              <td>${curso.precio}</td>
              <td>${curso.cantidad} </td>
              <td>
                   <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
              </td>
         `;
         contenedorCarrito.appendChild(row);
    });

}

function vaciarCarrito() {

    while(contenedorCarrito.firstChild) {
         contenedorCarrito.removeChild(contenedorCarrito.firstChild);
     }
}


const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();


const users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('12345678', 10), role: 'admin' },
  { id: 2, username: 'usuario1', password: bcrypt.hashSync('12345678', 10), role: 'user' },
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,
}));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user.id;
    req.session.role = user.role;

    if (user.role === 'admin') {
      return res.redirect('/admin-dashboard');
    } else {
      return res.redirect('/user-dashboard');
    }
  } else {
    res.send('Credenciales incorrectas');
  }
});


app.get('/admin-dashboard', (req, res) => {
  if (req.session.role === 'admin') {
    res.send('<h1>Bienvenido al panel de administrador</h1><a href="/logout">Cerrar sesión</a>');
  } else {
    res.redirect('/');
  }
});


app.get('/user-dashboard', (req, res) => {
  if (req.session.role === 'user') {
    res.send('<h1>Bienvenido al panel de usuario</h1><a href="/logout">Cerrar sesión</a>');
  } else {
    res.redirect('/');
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error al cerrar sesión');
    }
    res.redirect('/');
  });
});


app.listen(3000, () => {
  console.log('Servidor en el puerto 3000');
});

login-system/
├── public/
│   ├── index.html       // Página de inicio de sesión
│   ├── index2.html      // Página de ventas
│   ├── script.js        // Lógica de redirección
│
├── app.js               // Código de servidor Node.js
└── package.json         // Archivo de configuración de Node.js
