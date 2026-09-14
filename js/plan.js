const KEY = "tonight";

function loadPlan() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function savePlan(patch) {
  const next = { ...loadPlan(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

function clearPlan() {
  localStorage.removeItem(KEY);
}

function wireStep({ inputName, button, key, next, single = false }) {
  const inputs = [...document.querySelectorAll(`input[name="${inputName}"]`)];
  const picked = () =>
    inputs.filter((i) => i.checked).map((i) => i.value);

  const sync = () => {
    button.disabled = picked().length === 0;
  };

  inputs.forEach((input) => input.addEventListener("change", sync));
  sync();

  button.addEventListener("click", () => {
    const values = picked();
    if (!values.length) return;
    savePlan({ [key]: single ? values[0] : values });
    location.href = next;
  });
}
