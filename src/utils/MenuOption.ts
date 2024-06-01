import { Control, Container, StackPanel, Button, AdvancedDynamicTexture } from "@babylonjs/gui";

export class MenuOptions
{
    height: string;
    color: string;
    background: string;
    advancedTexture: AdvancedDynamicTexture;
    container: Container;
    button: Button;
    options: StackPanel;
	constructor(advancedTexture: AdvancedDynamicTexture,
        primaryText: string,
        width?: number,
        height?: number,
        color?: string,
        background?: string,
        align?: number,
        valign?: number)
	{
		const width_str = (width || 180)+"px";
        this.height = (height || 40)+"px";
        this.color = color || "black";
        this.background = background || "white";

		this.advancedTexture = advancedTexture;

        // Container
		this.container = new Container();
        this.container.width = width_str;
        this.container.verticalAlignment = align || Control.VERTICAL_ALIGNMENT_TOP;
		this.container.horizontalAlignment = valign || Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.container.isHitTestVisible = false;

        // Primary button
        this.button = Button.CreateSimpleButton('', primaryText || "Please Select");
        this.button.height = this.height;
        this.button.background = this.background;
        this.button.color = this.color;
        this.button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        // Options panel
        this.options = new StackPanel();
        this.options.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.options.top = this.height;		
        this.options.isVisible = false;
        this.options.isVertical = true;

       this.button.onPointerUpObservable.add(() => {
            this.options.isVisible = !this.options.isVisible;
        });

        this.container.onPointerEnterObservable.add(() =>{
            this.container.zIndex = 555; //some big value
        });

        this.container.onPointerOutObservable.add(() =>{
            this.container.zIndex = 0; //back to original
            this.options.isVisible = false;
        });

        // add controls
        this.advancedTexture.addControl(this.container);
        this.container.addControl(this.button);
        this.container.addControl(this.options);
	}

    get top() {
        return this.container.top;
    }

    set top(value) {
       this.container.top = value;
    }

    get left() {
        return this.container.left;
    }

    set left(value) {
       this.container.left = value;
    }

    addOption(id: string,text: string, callback: () => void)
	{
        const button = Button.CreateSimpleButton(id, text);
        button.height = this.height;
        button.paddingTop = "-1px";
        button.background = this.background;
        button.color = this.color;
        button.alpha = 1.0;
        button.onPointerUpObservable.add(() => {
            this.options.isVisible = false;
            const textBlock = this.button.textBlock;
            if(textBlock)
                textBlock.text = text;         
        });        
        button.onPointerClickObservable.add(callback); 
        this.options.addControl(button);
    }
}