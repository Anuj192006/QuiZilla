export function createOrg(data) {
  const token = localStorage.getItem("token");

  return fetch("https://quizilla-0gjl.onrender.com/api/orgs", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to create organisation");
    return res.json();
  });
}
