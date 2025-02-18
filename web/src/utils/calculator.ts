class Stack<T> {
    private stack: T[]
    constructor() {
        this.stack = []
    }

    public peek(): T | undefined {
        return this.stack[-1]
    }

    public push(value: T) {
        this.stack.push(value)
    }

    public pop(): T | undefined {
        return this.empty()
            ? undefined
            : this.stack.pop()
    }

    public empty(): boolean {
        return this.stack.length === 0
    }
}

interface Constant {
    num: number
}

interface Variable {
    key: string
}

enum Operation {
    EXP = '^',
    DIV = '/',
    MUL = '*',
    ADD = '+',
    SUB = '-',
}

interface Operator {
    operation: Operation
    operands: [Expression, Expression]
}

type ExpressionType = Operator | Constant | Variable

export class ExpressionContext {
    private context: Record<string, Expression>

    constructor(context: Record<string, Expression> = {}) {
        this.context = context
    }

    public set(key: string, exp: Expression) {
        this.context[key] = exp
    }

    public evaluate(key: string): number | undefined {
        if (this.has(key)) {
            return this.context[key].evaluate()
        }
        return undefined
    }

    public has(key: string): boolean {
        return this.context[key] !== undefined
    }

    public remove(key: string) {
        delete this.context[key]
    }
}

export class Expression<T extends ExpressionType = ExpressionType> {
    private value: T
    private context?: ExpressionContext

    constructor(value: T) {
        this.value = value
    }

    public static fromTokens(tokens: string[]): Expression<ExpressionType> {
        for (let token in tokens) {
            // TODO
        }
    }

    public withContext(context: ExpressionContext) {
        this.context = context
    }

    private isOperator(): this is Expression<Operator> {
        return 'operation' in this.value;
    }

    private isConstant(): this is Expression<Constant> {
        return 'num' in this.value;
    }

    private isVariable(): this is Expression<Variable> {
        return 'key' in this.value;
    }

    public evaluate(): number | undefined {
        if (this.isOperator()) {
            const [a, b] = this.value.operands.map((operand) => operand.evaluate())
            if (a === undefined || b === undefined) {
                return undefined
            }

            switch (this.value.operation) {
                case Operation.ADD:
                    return a + b
                case Operation.DIV:
                    return a / b
                case Operation.EXP:
                    return Math.pow(a, b)
                case Operation.MUL:
                    return a * b
                case Operation.SUB:
                    return a - b
            }
        } else if (this.isConstant()) {
            return this.value.num
        } else if (this.isVariable()) {
            if (this.context && this.context.has(this.value.key)) {
                return this.context.evaluate(this.value.key)
            }
        }
        return undefined
    }
}
