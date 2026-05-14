document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(form);

      await fetch(form.action, {
        method: "POST",
        body: formData
      });

      window.location.href = "thanks.html";
    } catch (error) {
      alert("Message failed. Please try again.");
    }
  });
});
