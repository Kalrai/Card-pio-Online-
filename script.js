const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const abreFechaSpan = document.getElementById("date-span")
const carrinhoModal = document.getElementById("cart-modal")
const carrinhoItemConteiner = document.getElementById("cart-items")
const carrinhoPrecoTotal = document.getElementById("cart-total")
const warnEnderecoIncompleto = document.getElementById("address-warn")
const fecharCarrinhoBtn = document.getElementById("close-modal-btn")
const checkOutBtn = document.getElementById("checkout-btn")
const contadorCarrinhoSpan = document.getElementById("cart-count")
const addressInput = document.getElementById("address")


let cart = [];


// Abrir Modal
cartBtn.addEventListener("click", function(){
    atualizaCarrinho();
    carrinhoModal.style.display = "flex"
})

//Fechar modal
carrinhoModal.addEventListener("click", function(event){
    if(event.target === carrinhoModal){
        carrinhoModal.style.display = "none"
    }
})
fecharCarrinhoBtn.addEventListener("click", function(){
    carrinhoModal.style.display = "none"
})

//botar item no carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        //adicionar no carrinho
        addToCart(name, price)

    }  
})

function addToCart(name, price){

    const itemExistente = cart.find(item => item.name === name)

    if(itemExistente){
        //se o item já existe a quantidade ganha +1
        itemExistente.quantidade += 1;
    }else{
        //o item ainda não ta no carrinho então adicono um item novo
        cart.push({
            name,
            price,
            quantidade: 1,
        })
    }
    atualizaCarrinho()
}

function atualizaCarrinho(){
    carrinhoItemConteiner.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justfy-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="bg-slate-100 p-2 rounded-sm drop-shadow-lg hover:shadow-2xl flex items-center justify-between"> 
                <div> 
                    <p class="font-medium"> ${item.name}</p>
                    <p>Quantidade: ${item.quantidade}</p>
                    <p class="font-medium mt-2"> R$ ${item.price.toFixed(2)}</p>
                </div>
                
                    <button data-name="${item.name}" class="remove-from-cart-btn hover:bg-red-500 rounded hover:text-white duration-300 p-2">
                        Remover
                    </button>
                
            </div>
        
        `
        total += item.price * item.quantidade;

        carrinhoItemConteiner.appendChild(cartItemElement)    })

        carrinhoPrecoTotal.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        contadorCarrinhoSpan.innerHTML = cart.length;

}

//identifica oque deve ser removido
carrinhoItemConteiner.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];
        if(item.quantidade > 1){
            item.quantidade -= 1
        } else {
            cart.splice(index, 1);
        }
        atualizaCarrinho();
    }
}

addressInput.addEventListener("click", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        warnEnderecoIncompleto.classList.add("hidden")
    }
})


checkOutBtn.addEventListener("click", function(){

    const isOpen = checkOpenClose()
    if(isOpen){
       
        Toastify({
            text: "Restaurante Fechado no Momento !",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#e44444",
            }
    }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        warnEnderecoIncompleto.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItems = cart.map((item) => {
        return(
            `||${item.name} Quantidade:(${item.quantidade}) Preço: R$${item.price}||`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "48996127910"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, `_blank`)

    cart= [];
    atualizaCarrinho();

    
})


// Função para checar se está aberto
function checkOpenClose() {
 
    const data = new Date();
    const diaDaSemana = data.getDay();
    const isDomingo = diaDaSemana === 0;
    const hora = data.getHours();
    const minuto = data.getMinutes();

   if (isDomingo){
    return false;
   }else{
    return (hora > 18 || (hora === 18 && minuto >= 0)) && (hora < 23 || (hora === 23 && minuto <= 30));
   }
}

// Atualizar span de aberto/fechado
const spanItem = document.getElementById("date-span");
const isOpen = checkOpenClose();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-500");
} else {
    spanItem.classList.remove("bg-green-500");
    spanItem.classList.add("bg-red-500");
}