import { BaseWindow } from "./BaseWindow";
import { ASSETS } from "../AssetsLoader";

/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

export class ObjectsListPanel extends BaseWindow {
    // static
    static innerHtml:string;

    // public
    public onObjectClick:Function;
    public filenamePrefix:string;

    public treesButton:HTMLInputElement;
    public actorsButton:HTMLInputElement;
    public housesButton:HTMLInputElement;

    // private 

    private objContainer:HTMLElement;

    private itemWidth:number;
    private itemHeight:number;
    private maxIdx:number
    private objects:Array<HTMLElement> = [];
    
    constructor(filenamePrefix:string, maxIdx:number, itemWidth:number, itemHeight:number) {
        super();

        this.filenamePrefix = filenamePrefix;
        this.itemWidth = itemWidth;
        this.itemHeight = itemHeight;
        this.maxIdx = maxIdx;

        this.objContainer = this.element.querySelector(".obj_list");
        this.treesButton = this.element.querySelector(".trees_button");
        this.actorsButton = this.element.querySelector(".actors_button");
        this.housesButton = this.element.querySelector(".houses_button");
        this.populate()
        // this.removeAll();
    
        this.treesButton.addEventListener('click', () => {
            this.filenamePrefix = 'tree';
            this.maxIdx = ASSETS.GRASS_MAX;
            this.repopulate();
        });
        this.housesButton.addEventListener('click', () => {
            this.filenamePrefix = 'house';
            this.maxIdx = ASSETS.HOUSE_MAX;
            this.repopulate();
        });
        this.actorsButton.addEventListener('click', () => {
            this.filenamePrefix = 'actor';
            this.maxIdx = 4;
            this.repopulate();
        });
    }

    private repopulate() {
        this.removeAll();
        this.populate();
    }
     
    private removeAll() {
        for (let object of this.objects) {
            this.objContainer.removeChild(object);
        }
        this.objects = []
    }

    private populate() {
        for(let idx = 1; idx <= this.maxIdx; idx++) {
            let filename = this.filenamePrefix + '_' + idx + '.png';
            let element = document.createElement('input');
            // element.className = "btn btn-blue";
            element.style.width = this.itemWidth + 'px';
            element.style.height = this.itemHeight + 'px';
            element.style.verticalAlign = "middle";
            element.type = "button";
            element.style.background = 'rgba(184,176,33,1) url(/assets/tilemap/'+filename+') no-repeat center';
            element.style.marginRight = '5px';
            element.addEventListener('click', ()=>{
                if (this.onObjectClick) {
                    this.onObjectClick(idx)
                }
            });
            
            this.objContainer.appendChild(element);
            this.objects.push(element);
        }
    }

    // Window HTML properties
    protected getWindowName(): string { return "objects_list_window" }
    protected getInnerHTML(): string  { return ObjectsListPanel.innerHtml }
    static initialize() {
        ObjectsListPanel.innerHtml = BaseWindow.getPrefab(".objects_list_window_prefab").innerHTML;
    }
}