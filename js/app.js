class TaxCalculator {
    constructor(priceInput, taxSelect, modeSelect, roundingSelect, result, error){
        this.priceInput = priceInput;
        this.taxSelect = taxSelect;
        this.modeSelect = modeSelect;
        this.roundingSelect = roundingSelect;
        this.result = result;
        this.error = error;

        this.initTaxRaters();
        this.init();
    }

    initTaxRaters(){
        const rates = [10, 8];

        // この部分で順番を変えることができます。
        // 

        rates.forEach(rate => {
            const option = document.createElement("option");
            option.value = rate;
            option.textContent = `${rate}%`;
            this.taxSelect.appendChild(option);
        });
    }

    init(){
        document.getElementById("calcBtn")
            .addEventListener("click", () => this.calculate());

        this.priceInput.addEventListener("input", () => {
            this.calculate();
        });

        this.taxSelect.addEventListener("change", () => {
            this.calculate();
        });

        this.modeSelect.addEventListener("change", () => {
            this.calculate();
        });

        this.roundingSelect.addEventListener("change", () => {
            this.calculate();
        });
    }

    validate(price){
        if(this.priceInput.value === ""){
            return "金額を入力してください";
        }
        if(isNaN(price)){
            return "正しい数値を入力してください";
        }
        if(price < 0){
            return "0以上で入力してください";
        }
        return null;
    }

    getInputValues(){
        return {
            price: Number(this.priceInput.value),
            taxRate: Number(this.taxSelect.value) / 100,
            mode: this.modeSelect.value
        };
    }

    applyRounding(value){
        const mode = this.roundingSelect.value;

        if(mode === "floor"){
            return Math.floor(value);
        }else if(mode === "ceil"){
            return Math.ceil(value);
        }else{
            return Math.round(value);
        }
    }

    calculate(){
        this.result.textContent = "";
        this.error.textContent = "";

        const inputDate = this.getInputValues();
        const price = inputDate.price;
        const taxRate = inputDate.taxRate;
        const mode = inputDate.mode;

        const errorMessage = this.validate(price);
        if(errorMessage){
            this.error.textContent = errorMessage;
            return;
        }
        // ==========================
        // ★　①　計算
        // ==========================
        let tax, total;

        if(mode === "exclusive"){
            // 税抜 → 税込
            tax = this.applyRounding(price * taxRate);
            total = price + tax;
        }else{
            // 税込 → 税抜
            total = price;
            tax = this.applyRounding(
                price - price / (1 + taxRate)
            );
        }

        // ==========================
        // ★　②　表示
        // ==========================
        if(mode === "exclusive"){
            this.result.innerHTML = `
                <div class="result-title">✅計算結果</div>
                消費税：${tax.toLocaleString()}円<br>
                税込価格：${total.toLocaleString()}円
            `;
        }else{
            const basePrice = total - tax;

            this.result.innerHTML = `
                <div class="result-title">✅計算結果</div>
                消費税：${tax.toLocaleString()}円<br>
                税抜価格：${basePrice.toLocaleString()}円
            `;
        }
    }
}

new TaxCalculator(
    document.getElementById("price"),
    document.getElementById("taxRate"),
    document.getElementById("mode"),
    document.getElementById("rounding"),
    document.getElementById("result"),
    document.getElementById("error")
);