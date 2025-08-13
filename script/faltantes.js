const { createClient } = supabase;

const supabaseUrl = 'https://xvmohhhurbvmqimchblh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bW9oaGh1cmJ2bXFpbWNoYmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODY0MzAsImV4cCI6MjA3MDY2MjQzMH0.3BuVtYLzjfJCAy0ZTT7NIdRuo7Oa5g0XYm7wcVUt4ko'; // Usa tu clave real
const db = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addPiezaForm');
  const tableBody = document.querySelector('#piezaTable tbody');

  if (!form || !tableBody) {
    console.error('Formulario o tabla no encontrados');
    return;
  }

  // Cargar faltantes
  async function loadFaltantes() {
    const { data, error } = await db
      .from('faltantes')
      .select('id, nombre, compania')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error al cargar faltantes:', error);
      return;
    }

    tableBody.innerHTML = '';
    data.forEach(pieza => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${pieza.nombre}</td>
        <td>${pieza.compania || '-'}</td>
        <td><button class="btn danger" onclick="eliminar(${pieza.id})">Eliminar</button></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Agregar faltante
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('pName').value.trim();
    const compania = document.getElementById('pCompany').value.trim();

    if (!nombre) return;

    const { error } = await db
      .from('faltantes')
      .insert([{ nombre, compania }]);

    if (error) {
      alert('Error al agregar pieza.');
      console.error(error);
      return;
    }

    form.reset();
    loadFaltantes();
  });

  // Eliminar faltante
  window.eliminar = async (id) => {
    const confirmar = confirm("¿Eliminar esta pieza?");
    if (!confirmar) return;

    const { error } = await db.from('faltantes').delete().eq('id', id);
    if (error) {
      alert('Error al eliminar.');
      console.error(error);
      return;
    }

    loadFaltantes();
  };

  loadFaltantes();
});
