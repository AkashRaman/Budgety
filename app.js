

var budgetController = (function() {
    var percentArr = []; 
    var availableBudget = 0;
    var totalIncome = 0;
    var totalExpense = 0;
    
    var allIncomes = [];
    var allExpenses = [];
    
    var Income = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Expense = function(id,description,value,percent) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percent = percent;
    };
    
    function addArray(inputObj) {
        var newItem;
        if (inputObj.type === 'inc') {
            newItem = new Income(allIncomes.length,inputObj.description,inputObj.value);
            allIncomes.push(newItem);
            addTotalIncome();
        } else if (inputObj.type === 'exp') {
            var elementPercent;
            
            if (totalIncome === 0) {
                elementPercent = -1;
            } else if (totalIncome > 0) {
              elementPercent  = Math.round((inputObj.value * 100) / totalIncome);  
            };
            
            newItem = new Expense(allExpenses.length,inputObj.description,inputObj.value, elementPercent);
            allExpenses.push(newItem);
            addTotalExpense();
        };
        return newItem;
    };
    
    function addTotalIncome() {
        totalIncome = 0;
        for (var i = 0; i < allIncomes.length; i++) {
            var x = allIncomes[i].value;
            totalIncome +=  x;
        };
        availableBudget = totalIncome - totalExpense;
    };
    
    function addTotalExpense() {
        totalExpense = 0;
        for (var i = 0; i < allExpenses.length; i++) {
            var x = allExpenses[i].value;
            totalExpense +=  x;
        };
        availableBudget = totalIncome - totalExpense;
    };
    
    return {
        storeInput: function(inputObj) {
            var outputObj = addArray(inputObj);
            return {
                outputObj: outputObj,
                availableBudget: availableBudget,
                totalIncome: totalIncome,
                totalExpense: totalExpense,
                
            }
        }
    };
    
})();


var uiController = (function() {
    var showBudgetOutput = function(newObj,objType) {
        var sign = "+";
        if (Math.sign(newObj.availableBudget) === -1) { 
            sign = "-"; 
            newObj.availableBudget = Math.abs(newObj.availableBudget);
        };
        
        var html, element;
        
        if (objType === 'inc'){
            element = '.income__list';
            html = '<div class="item clearfix" id="income-'+ newObj.outputObj.id + '"><div class="item__description">'+ newObj.outputObj.description + '</div><div class="right clearfix"><div class="item__value">+ '+ newObj.outputObj.value + '</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (objType === 'exp'){
            element = '.expenses__list';
            html = '<div class="item clearfix" id="income-'+ newObj.outputObj.id + '"><div class="item__description">'+ newObj.outputObj.description + '</div><div class="right clearfix"><div class="item__value">+ '+ newObj.outputObj.value + '</div><div class="item__percentage">0%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        };
        document.querySelector('.budget__value').innerHTML = sign + " " + newObj.availableBudget;
        document.querySelector('.budget__income--value').innerHTML = "+ " + newObj.totalIncome;
        document.querySelector('.budget__expenses--value').innerHTML = "- " + newObj.totalExpense;
        //document.querySelector('.budget__expenses--percentage').innerHTML = totalPercentStr;
        document.querySelector(element).insertAdjacentHTML('beforeend',html);
    };
    
    var clear = function() {
        var fixes, fixesArr;
        fixes = document.querySelectorAll('.add__description , .add__value');
        fixesArr = Array.prototype.slice.call(fixes);
        
        fixesArr.forEach(function(current, index, array) {
            current.value = "";
        });
        fixesArr[0].focus();
    }
    
    return {
        getInput: function() {
            var description = document.querySelector('.add__description').value;
            var value = parseFloat(document.querySelector('.add__value').value); 
            if (description === '' || isNaN(value) || value === 0) {
                document.querySelector('.board').classList.add("notice");
                if (description === '' && value === '') {
                    document.querySelector('.board').innerHTML = "Enter the DESCRIPTION and VALUE to calculate the budget";
                } else if (description === '') {
                    document.querySelector('.board').innerHTML = "Enter the DESCRIPTION to calculate the budget";
                } else if (isNaN(value) || value === 0) {
                    document.querySelector('.board').innerHTML = "Enter the VALUE to calculate the budget";
                };
            } else {
                document.querySelector('.board').classList.remove("notice");
                document.querySelector('.board').innerHTML = "";
                return {
                type: document.querySelector('.add__type').value,
                description: description,
                value: value
            }};
        },
        showOutput: function(outputObj,type) {
            showBudgetOutput(outputObj,type); 
        },
        clearFix: function() {
            clear();
        }
    };
    
})();

var controller = (function(budgetCtrl,uiCtrl) {
    
    var ctrlAddItem = function() {
        var input = uiCtrl.getInput();
        if (typeof input !== "undefined") {
            var output = budgetCtrl.storeInput(input);
            uiCtrl.showOutput(output, input.type);
            uiCtrl.clearFix();
        };  
    };
    
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        };
    });
    
    
})(budgetController,uiController);




