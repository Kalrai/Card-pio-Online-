const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const abreFechaSpan = document.getElementById("date-span")
const carrinhoModal = document.getElementById("cart-modal")
const carrinhoItemConteiner = document.getElementById("cart-items")
const carrinhoPrecoTotal = document.getElementById("cart-total")
const warnEnderecoIncompleto = document.getElementById("address-wanr")
const fecharCarrinhoBtn = document.getElementById("close-modal-btn")
const finalizarPedidoBtn = document.getElementById("checkout-btn")
const contadorCarrinhoSpan = document.getElementById("cart-count")

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
                
                    <button class="hover:bg-red-500 rounded hover:text-white duration-300 p-2">
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

