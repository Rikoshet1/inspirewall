export async function getInspirations() {
  const response = await fetch('/api/inspirations');

  if (!response.ok) {
    throw new Error(`שגיאת שרת ${response.status}`);
  }

  const items = await response.json();

  if (!Array.isArray(items)) {
    throw new Error('התקבלה תשובה לא תקינה מהשרת');
  }

  return [...items].sort((first, second) => {
    const firstDate = Date.parse(first.createdAt ?? '') || 0;
    const secondDate = Date.parse(second.createdAt ?? '') || 0;
    return secondDate - firstDate;
  });
}

export async function createInspiration(inspiration) {
  const response = await fetch('/api/inspirations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inspiration),
  });

  if (!response.ok) {
    throw new Error(`שגיאת שרת ${response.status}`);
  }

  return response.json();
}
