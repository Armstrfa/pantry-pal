const form=document.querySelector('#recipe-form');
const ingredientsField=document.querySelector('#ingredients');
const charCount=document.querySelector('#char-count');
const submitButton=document.querySelector('#submit-btn');
const emptyState=document.querySelector('#empty-state');
const loadingState=document.querySelector('#loading-state');
const recipeCard=document.querySelector('#recipe');

ingredientsField.addEventListener('input',()=>{charCount.textContent=`${ingredientsField.value.length} / 240`;});
document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>{
  ingredientsField.value=chip.dataset.ingredients;
  charCount.textContent=`${ingredientsField.value.length} / 240`;
  ingredientsField.focus();
}));

function esc(value=''){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function list(items,tag){return `<${tag}>${(items||[]).map(item=>`<li>${esc(item)}</li>`).join('')}</${tag}>`;}
function showRecipe(data){
  const steps=Array.isArray(data.steps)?data.steps:[];
  const ingredients=Array.isArray(data.ingredients)?data.ingredients:[];
  recipeCard.innerHTML=`<div class="recipe-top"><span class="recipe-tag">✳ &nbsp; MADE FROM YOUR FRIDGE</span><button class="save-btn" type="button" id="copy-recipe">Copy recipe ↗</button></div>
    <h2>${esc(data.title||'A little fridge magic')}</h2><p class="recipe-desc">${esc(data.description||'A simple, satisfying way to use what you have.')}</p>
    <div class="recipe-stats"><div class="stat">PREP<strong>${esc(data.prepTime||'10 min')}</strong></div><div class="stat">COOK<strong>${esc(data.cookTime||'20 min')}</strong></div><div class="stat">SERVES<strong>${esc(data.servings||'2')}</strong></div></div>
    <div class="recipe-columns"><section><h3>Gather</h3>${list(ingredients,'ul')}</section><section><h3>Make it</h3>${list(steps,'ol')}</section></div>
    <div class="swap-box"><h3>A clever swap</h3><p>${esc(data.substitutionTips||'Use what you have: taste as you go and swap in a similar ingredient if needed.')}</p></div>`;
  recipeCard.classList.remove('hidden');
  document.querySelector('#copy-recipe').addEventListener('click',async event=>{
    const text=`${data.title}\n\n${data.description||''}\n\nIngredients\n${ingredients.map(x=>'• '+x).join('\n')}\n\nSteps\n${steps.map((x,i)=>`${i+1}. ${x}`).join('\n')}\n\nSwap: ${data.substitutionTips||''}`;
    try{await navigator.clipboard.writeText(text);event.currentTarget.textContent='Copied ✓';}catch{event.currentTarget.textContent='Select to copy';}
  });
}
form.addEventListener('submit',async event=>{
  event.preventDefault();
  const ingredients=ingredientsField.value.split(',').map(x=>x.trim()).filter(Boolean);
  if(ingredients.length<3||ingredients.length>5){
    emptyState.classList.add('hidden');
    loadingState.classList.add('hidden');
    recipeCard.innerHTML='<div class="error-message">Add 3 to 5 ingredients, separated by commas, and we’ll find a recipe for you.</div>';
    recipeCard.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');recipeCard.classList.add('hidden');loadingState.classList.remove('hidden');submitButton.disabled=true;submitButton.querySelector('.btn-label').textContent='Cooking up ideas…';
  try{
    const response=await fetch('/api/recipe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ingredients,servings:Number(document.querySelector('#servings').value),vegetarian:document.querySelector('#vegetarian').checked})});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error||'Something went wrong. Please try again.');
    showRecipe(data);
  }catch(error){
    recipeCard.innerHTML=`<div class="error-message">${esc(error.message)}<br /><br />Make sure the app’s AI connection is configured, then give it another go.</div><button class="save-btn" style="margin-top:14px" onclick="location.reload()">Try again</button>`;
    recipeCard.classList.remove('hidden');
  }finally{loadingState.classList.add('hidden');submitButton.disabled=false;submitButton.querySelector('.btn-label').textContent='Find my recipe';}
});
