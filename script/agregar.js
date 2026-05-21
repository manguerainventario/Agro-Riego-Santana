const { createClient } = supabase;
const supabaseUrl = 'https://xvmohhhurbvmqimchblh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bW9oaGh1cmJ2bXFpbWNoYmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODY0MzAsImV4cCI6MjA3MDY2MjQzMH0.3BuVtYLzjfJCAy0ZTT7NIdRuo7Oa5g0XYm7wcVUt4ko';
const db = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addMangueraForm');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('mName').value.trim();
    const cantidad = parseInt(document.getElementById('mCantidad').value);
    const metros = parseInt(document.getElementById('mMetros').value);
    if (!nombre || cantidad < 0 || metros < 0) return;

    const { error } = await db.from('mangueras').insert([{ nombre, cantidad, metros_disponibles: metros }]);
    if (error) {
      alert('Error al agregar la manguera');
      console.error(error);
      return;
    }

    alert('Manguera agregada con éxito');
    form.reset();
  });
});
