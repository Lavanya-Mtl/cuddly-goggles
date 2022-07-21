document.addEventListener("DOMContentLoaded", function() {
    var num1=0,num2=0,op=null;
    const caltext = document.getElementById('caltext');
    document.querySelectorAll('button').forEach(function(button) {
        button.onclick = function() {
            let ch=button.dataset.btnchar;
            if(ch=="=") {
                infixToPostfix(caltext.value);
                caltext.value=evalPostfix();
                queue=[];stack=[];
            }
            else if(ch=="AC") {//resetting
                caltext.value="";
                queue=[];stack=[];
            }
            else if (ch=="del") {
                caltext.value=caltext.value.slice(0,caltext.value.length-1);
            }
            else if(ch=='sq') {
                infixToPostfix(caltext.value);
                num1=evalPostfix();
                caltext.value=Math.sqrt(num1);
                num1=0;queue=[];stack=[];
            }
            else {
                caltext.value = caltext.value+button.dataset.btnchar;
            }
            
        }
    });
});
let stack=[];
let queue=[];
const precedence = {'%':5,'/':4,'x':3,'+':2,'-':1};//high to low
function Calculate(num1,num2,op) {
    let result;
    
    if(op=='+') {
        result=num1+num2;
    }
    else if(op=='-') {
        result=num1-num2;
    }
    else if(op=='x') {
        result=num1*num2;
    }
    else if(op=='/') {
        if(num2==0) {
            result="Error";
        }
        else {
            result=num1/num2;
        }
    }
    else if(op=='%') {
        result=num1%num2;
    }
    else {
        return 0;
    }
    //console.log(num1+op+num2+"="+result);
    return result;
}
function checkPrecedenceAndPush(op) {
    if(op in precedence) {
        if (stack.length==0){
            stack.push(op);
            return;
        }
        while(precedence[stack[stack.length-1]]>precedence[op])
        {
            queue.push(stack.pop());
        }
        stack.push(op);
    }
}
function enqueuestack() {
    let l=stack.length;
    for (let i=0;i<l;i++){
        ////console.log(stack.length+" and "+i);
        queue.push(stack.pop());

    } 
}
function infixToPostfix(str) {
    let c=0;
    let num=0
    for(let i=0; i<str.length; i++) {
        if (str[i]>='0' && str[i] <= '9') {//its a digit
            c++;i++;
            while ((str[i]>='0' && str[i] <= '9')||str[i]=='.') {
                c++;i++;
            }//when the loop ends i will be at an operator or end of string, c will have the length of the operand
            num = parseFloat(str.slice(i-c,i));
            //console.log(num);
            queue.push(num);
            c=0;
        }
        //console.log(str[i]);
        checkPrecedenceAndPush(str[i]);
    }
    enqueuestack();
}
function evalPostfix() {
    let num1=0,num2=0;
    while(queue.length>0) {
        if(isNaN(queue[0])) {//its an operator
            num2=stack.pop();
            //console.log("num2:"+num2);
            num1=stack.pop();
            //console.log("num1:"+num1);
            //console.log("op:"+queue[0]);
            stack.push(Calculate(num1,num2,queue.shift()));
            
        }
        else {
            //console.log("Push ot stack: "+queue[0]);
            
            stack.push(queue.shift());
            //console.log("stackis: "+stack);
        }
        
    }
    if(stack.length!=1) {
        return "Error";
    }
    return stack.pop();
}

