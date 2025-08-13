const { createClient } = supabase;
const supabaseUrl = 'https://xvmohhhurbvmqimchblh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bW9oaGh1cmJ2bXFpbWNoYmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODY0MzAsImV4cCI6MjA3MDY2MjQzMH0.3BuVtYLzjfJCAy0ZTT7NIdRuo7Oa5g0XYm7wcVUt4ko';
const db = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#mangueraTable tbody');

  async function loadMangueras() {
    const { data, error } = await db.from('mangueras').select();
    if (error) {
      console.error('Error al cargar:', error);
      return;
    }

    // Ordenar datos alfabéticamente con orden numérico natural en el nombre
    data.sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true, sensitivity: 'base' }));

    tableBody.innerHTML = '';
    data.forEach((m) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${m.nombre}</td>
        <td id="cant-${m.id}"><strong>${m.cantidad}</strong></td>
        <td id="disp-${m.id}">${m.metros_disponibles}</td>
        <td class="actions-cell">
          <button onclick="modificar(${m.id}, 'metros', 1)">+ Metro</button>
          <button onclick="modificar(${m.id}, 'metros', -1)">– Metro</button>
          <button onclick="modificar(${m.id}, 'cantidad', 1)">+ Manguera</button>
          <button onclick="modificar(${m.id}, 'cantidad', -1)">– Manguera</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  window.modificar = async (id, campo, delta) => {
    const { data, error } = await db.from('mangueras').select().eq('id', id).single();
    if (error) return console.error(error);

    const cantidadInput = parseInt(prompt(`¿Cuántos ${campo === 'metros' ? 'metros' : 'rollos'} quieres ${delta > 0 ? 'agregar' : 'quitar'}?`, 1));
    if (isNaN(cantidadInput) || cantidadInput <= 0) return;

    const nuevoValor = data[campo === 'metros' ? 'metros_disponibles' : 'cantidad'] + (delta * cantidadInput);
    if (nuevoValor < 0) {
      alert("No puedes tener valores negativos.");
      return;
    }

    const updateObj = {};
    if (campo === 'metros') updateObj.metros_disponibles = nuevoValor;
    else updateObj.cantidad = nuevoValor;

    await db.from('mangueras').update(updateObj).eq('id', id);
    document.getElementById(`${campo === 'metros' ? 'disp' : 'cant'}-${id}`).innerText = nuevoValor;
  };

  loadMangueras();
});
