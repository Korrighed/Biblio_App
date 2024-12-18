<template>
    <div class="modal-overlay">
        <div class="container">
            <div class="row justify-content-center">
                <div class="modal-content col-10 col-md-6 col-lg-4">
                    <button @click="$emit('close')" class="btn-close"></button>
                    <form class="w-100">
                        <div class="mb-2 col-12">
                            Identifiant, il s'agit de votre identifiant au sein de l'association. 
                            <input type="email" class="form-control" id="volunterId" />
                        </div>
                        <div class="mb-2 col-12">
                            Mots de passe
                            <input type="password" class="form-control" id="password" />
                        </div>
                        <div class="mb-2 col-12 text-end">
                            <a href="#" class="justify-content-end">Réinitialiser son mot de passe</a>
                        </div>
                        <div class="row justify-content-between">
                            <button type="submit" class="btn btn-primary col-sm-3 mx-auto mb-2">S'incrir</button>
                            <button type="submit" class="btn btn-primary col-sm-3 mx-auto ">Se connecter</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineEmits(['close']);
</script>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    background-color: #6F4E37 !important;
    color: white !important;
    padding: 20px;
    border-radius: 8px !important;
    max-width: 50%; 
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
}
.btn-close {
    position: absolute;
    top: 10px;
    right: 10px;
}

</style>
