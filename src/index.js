function eval() {
    // Do not use eval!!!
    return;
}

function checkBrackets(expr){
    let bracketsSum=0;
    for(let i=0; i<expr.length; i++){
        switch (expr[i]){
            case '(': 
                bracketsSum++;
                break;
            case ')':
                bracketsSum --
                break;
        }
    }
    if(bracketsSum == 0) return true;

    return false;
}

//* convert expression to Reverse Polish notation (E.W. Dijkstra algorithm)
function translate_to_RPN(expr){
    const operators='()*/+-';
    const priority = {
            '(': 0,
            ')': 1,
            '+': 2,
            '-': 2,
            '*': 3,
            '/': 3
    };
    const eos = '\n';
    let operation_stack = [eos];
    let result =[];
    expr += eos;
    let number = '';
    
    for(let cur_pos=0; cur_pos < expr.length; cur_pos++){
        
        let cur_char = expr[cur_pos];
        
        if( cur_char == ' '){
            continue;
        }

        if (cur_char == eos){
            
            if (number){
                result.push(number);
                number = '';
            }

            let tmp = operation_stack.pop();
            while( tmp != eos){ 
                result.push(tmp);
                tmp = operation_stack.pop();
            }
            continue;
        }

        if(operators.indexOf(cur_char) == -1){
            number += cur_char;
            continue;
        }

        //operator found
            
        if (number){
            result.push(number);
            number = '';
        }
        
        if( cur_char == '(' ){
            operation_stack.push(cur_char);
            continue;
        }

        if( cur_char == ')' ){ 
                
            let tmp = operation_stack.pop();
            
            while( tmp != '(' ){  //check brackets pair in another place
                result.push(tmp);
                tmp = operation_stack.pop();
            }
            continue;
        }               

        let cur_op_priority = priority[cur_char];
        let stack_op_priority = priority[operation_stack[operation_stack.length-1]];
        
        if(cur_op_priority > stack_op_priority || operation_stack[operation_stack.length-1] == eos ){
            operation_stack.push(cur_char);
        }
        else{
                    
            do{
                let tmp = operation_stack.pop();
                result.push(tmp);
                stack_op_priority = priority[operation_stack[operation_stack.length-1]];

            }while(stack_op_priority >= cur_op_priority && operation_stack[operation_stack.length-1] != eos);
                  
            operation_stack.push(cur_char);
        }
                
    }

    return result;
}

//*
// evaluate expression in RPN
// @param: expr is RPN expression as array
//*
function eval_RPN(expr){
    
    const operators='*/+-';
    let result_stack = [];

    for(let i=0; i<expr.length; i++){
        
        if(operators.indexOf(expr[i]) == -1){
            result_stack.push(expr[i]);
            continue;
        }
        
        
        let op2 = result_stack.pop();
        let op1 = result_stack.pop();
        
        switch (expr[i]){
            case '+':
                result_stack.push( +op1 + +op2);
                break;
            case '-':
                result_stack.push(op1 - op2);
                break;
            case '*':
                result_stack.push(op1 * op2);
                break;
            case '/':
                if (+op2 == 0) { 
                    throw new Error ('TypeError: Division by zero.');
                }
                result_stack.push(op1 / op2);
                break;
        }
    }
    
    return +result_stack;
}

function expressionCalculator(expr) {
    // write your solution here
    if( !checkBrackets(expr) ){
        throw new Error('ExpressionError: Brackets must be paired');
    }

    return eval_RPN(translate_to_RPN(expr));
}

module.exports = {
     expressionCalculator
}