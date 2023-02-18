<template>
    <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <svg aria-hidden="true" class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </div>
    <input v-if="isSearching" v-model="messageKeyword" @keyup.up="switchResultUp" @keyup.down="switchResultDown" type="text" id="default-search" class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-600 focus:border-indigo-600" placeholder="Search anything in the chat..." required>
    <div class="flex-col items-center justify-center absolute right-2.5 bottom-2.5 px-1 pt-2 pb-1">
        <span v-if="filteredNode.length" :class="filteredNode.length > 1 ? 'mx-2' : ''" class="font-base text-sm">{{nodeIndex+1}}/{{filteredNode.length}}</span>
        <font-awesome-icon v-if="filteredNode.length > 1" @click="switchResultUp" class="font-medium text-md mr-2 cursor-pointer" icon="fa-solid fa-arrow-up" /> 
        <font-awesome-icon v-if="filteredNode.length > 1" @click="switchResultDown" class="font-medium text-md cursor-pointer" icon="fa-solid fa-arrow-down" />
    </div>
</template>

<script>

import {ref, watch, nextTick, onUnmounted} from 'vue'

export default {

    props: ['isSearching', 'messagesContainer'],

    setup(props, context) {

        const messageKeyword = ref('')

        const filteredNode = ref([])

        const nodeIndex = ref(0)

        const highlighted = ref([])

        watch(messageKeyword, async()=>{

            //Reset highlight
            if(highlighted.value.length){
                highlighted.value.map(el => el.classList.remove('highlight'))
            }

            //Populate the array with filtred results
            if(messageKeyword.value.length >= 1){
                nodeIndex.value = 0
                filteredNode.value = []
                let spanNode = document.querySelectorAll('.message-box')
                filteredNode.value = [...spanNode].filter(el => el.innerHTML.toLowerCase().includes(messageKeyword.value.toLowerCase()))
            }

            //If there are results scroll to and highlight the first result
            if(filteredNode.value.length){

                //Highlight the first result
                filteredNode.value[0].children[0].classList.add("highlight")
                highlighted.value.push(filteredNode.value[0].children[0])

                //Await for the DOM to update
                await nextTick()  

                //Position of the message inside the messages' container
                let position = filteredNode.value[0].offsetTop - props.messagesContainer.offsetTop  

                //Scroll to the result
                context.emit('scrollContainer', position)
            }

            //Reset everything when input is empty
            if(messageKeyword.value.length == 0){
                highlighted.value.map(el => el.classList.remove('highlight'))
                filteredNode.value = []
                nodeIndex.value = 0
            }
        })

        const switchResultDown = async()=>{
            if(filteredNode.value.length){ //if results array is not empty
                if(nodeIndex.value < filteredNode.value.length -1){ 

                    //Increment result index
                    nodeIndex.value++

                    //Remove Highlight previous result
                    filteredNode.value[nodeIndex.value -1].children[0].classList.remove("highlight") 
                    highlighted.value.push(filteredNode.value[nodeIndex.value -1].children[0])
                    
                    //Highlight next result
                    filteredNode.value[nodeIndex.value].children[0].classList.add("highlight") 
                    highlighted.value.push(filteredNode.value[nodeIndex.value].children[0])

                    //Await for the DOM to update       
                    await nextTick()  

                    //Position of the message inside the messages' container
                    let position = filteredNode.value[nodeIndex.value].offsetTop - props.messagesContainer.offsetTop  

                    //Scroll to the result
                    context.emit('scrollContainer', position)
                }
            }
        }

        const switchResultUp = async()=>{
            if(filteredNode.value.length){ //if results array is not empty
                if(nodeIndex.value > 0){ 

                    //Increment result index
                    nodeIndex.value = nodeIndex.value - 1

                    //Remove Highlight previous result
                    filteredNode.value[nodeIndex.value +1].children[0].classList.remove("highlight") 
                    highlighted.value.push(filteredNode.value[nodeIndex.value +1].children[0])
                    
                    //Highlight next result
                    filteredNode.value[nodeIndex.value].children[0].classList.add("highlight") 
                    highlighted.value.push(filteredNode.value[nodeIndex.value].children[0])

                    //Await for the DOM to update       
                    await nextTick()  

                    //Position of the message inside the messages' container
                    let position = filteredNode.value[nodeIndex.value].offsetTop - props.messagesContainer.offsetTop  

                    //Scroll to the result
                    context.emit('scrollContainer', position)
                }
            }
        }

        onUnmounted(()=>{
            if(highlighted.value.length){
                highlighted.value.map(el => el.classList.remove('highlight'))
            }
        })

        return{
            messageKeyword, filteredNode, nodeIndex, switchResultDown, switchResultUp, highlighted
        }
    },
}
</script>