window.addEventListener('load', main, false);

// config
var WINDOW_WIDTH = 450;
var WINDOW_HEIGHT = 300;

var MAP_WIDTH = 15;
var MAP_HEIGHT = 10;

var CROSSOVER_RATE = 0.7;
var MUTATION_RATE = 0.001;

var POP_SIZE = 140;
var CHROMO_LENGTH = 70;
var GENE_LENGTH = 2;

var COLOR = {
    white: 0xFFFFFF,
    black: 0x000000,
    gray: 0x808080,
    red: 0xFF0000
};

var keyCode = null;

function main() {
    var gameInfo = {};
    var stage = new PIXI.Stage(0xFFFFFF);
    var renderer = PIXI.autoDetectRenderer(WINDOW_WIDTH, WINDOW_HEIGHT);

    document.body.appendChild(renderer.view);

    var gaBob = new GaBob();
    GaBob.show(stage);

    registerKeyEvent();

    requestAnimFrame(animate);
    function animate() {
        loop(gameInfo);

        renderer.render(stage);
        requestAnimFrame(animate);
    }
}

function loop(gameInfo) {
    var char = keyCode;
    keyCode = null;

    switch (char) {
    case ' ':
        console.log('into space process');
        gameInfo.map.memoryRender();
        break;
    case 'T':
        console.log('into test route Path');
        var path = gameInfo.map.genTestPath();
        var fit = gameInfo.map.testRoute(path);
        gameInfo.map.memoryRender();
        var result = {
            testPath: path,
            fit: fit,
            map: gameInfo.map
        };
        console.log('get result', result);
        break;
    case 'D':
        debugger;
        break;
    }
}

function registerKeyEvent() {
    document.addEventListener('keydown', function(event) {
        console.log('key down', event);
        var char = String.fromCharCode(event.keyCode);
        console.log('press key [%s], keyCode', char, event.keyCode);
        keyCode = char;
    });
}

/*
 class BobsMap
*/
function BobsMap() {
    this.map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
        [8, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 5],
        [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    this.border = 20; // 四周边界
    this.blockSizeX = (WINDOW_WIDTH - 2 * this.border) / MAP_WIDTH;
    this.blockSizeY = (WINDOW_HEIGHT - 2 * this.border) / MAP_HEIGHT;

    this.startX = 14;
    this.startY = 7;
    this.endX = 0;
    this.endY = 2;

    // init this.memory to 0
    this.memory = this.getCleanMemory();

    this.graphics = new PIXI.Graphics();
    this.memoryGraphics = new PIXI.Graphics();
}

BobsMap.prototype.drawRectWithColor = function (graphics, rectInfo, color) {
    graphics.lineStyle(1, COLOR.gray);
    graphics.beginFill(color);
    graphics.drawRect(rectInfo.left, rectInfo.top, rectInfo.width, rectInfo.height);
    graphics.endFill();
};

BobsMap.prototype.render = function () {
    var i, j;

    var gh = this.graphics;
    gh.clear();

    for (i = 0; i < MAP_HEIGHT; i++) {
        for (j = 0; j < MAP_WIDTH; j++) {
            var left = this.border + j * this.blockSizeX;
            var top = this.border + i * this.blockSizeY;

            var rectInfo = {
                left: left,
                top: top,
                width: this.blockSizeX,
                height: this.blockSizeY
            };

            switch (this.map[i][j]) {
            case 0:
                this.drawRectWithColor(gh, rectInfo, COLOR.white);
                break;
            case 1:
                this.drawRectWithColor(gh, rectInfo, COLOR.black);
                break;
            case 5:
            case 8:
                this.drawRectWithColor(gh, rectInfo, COLOR.red);
                break;
            }
        }
    }
};

BobsMap.prototype.getCleanMemory = function () {
    var mem = [];
    var i, j;
    for (i = 0; i < MAP_HEIGHT; i++) {
        mem.push([]);
        for (j = 0; j < MAP_WIDTH; j++) {
            mem[i].push(0);
        }
    }
    return mem;
};

BobsMap.prototype.memoryRender = function () {
    var y, x;

    this.memoryGraphics.clear();
    for (y = 0; y < MAP_HEIGHT; y++) {
        for (x = 0; x < MAP_WIDTH; x++) {
            var left = this.border + this.blockSizeX * x;
            var top = this.border + this.blockSizeY * y;

            var rectInfo = {
                left: left,
                top: top,
                width: this.blockSizeX,
                height: this.blockSizeY
            };

            if (this.memory[y][x] == 1) {
                this.drawRectWithColor(this.memoryGraphics, rectInfo, COLOR.gray);
            }
        }
    }
};

BobsMap.prototype.show = function (stage) {
    stage.addChild(this.graphics);
    stage.addChild(this.memoryGraphics);
};

BobsMap.prototype.hide = function (stage) {
    stage.removeChild(this.graphics);
    stage.removeChild(this.memoryGraphics);
};

BobsMap.prototype.genTestPath = function () {
    var path = [];
    for (var i = 0; i < CHROMO_LENGTH; i++) {
        path.push('nsew'[Math.floor(Math.random() * 4)]);
    }

    return path;
};

BobsMap.prototype.testRoute = function (path) {
    var i;
    var posX = this.startX;
    var posY = this.startY;

    this.memory = this.getCleanMemory();
    for (i = 0; i < path.length; i++) {
        switch (path[i]) {
        case 'n': // North
            if ((posY - 1) >= 0 && (this.map[posY-1][posX] != 1)) {
                posY -= 1;
            }
            break;
        case 's': // South
            if ((posY + 1) < MAP_HEIGHT && (this.map[posY+1][posX] != 1)) {
                posY += 1;
            }
            break;
        case 'e': // East
            if ((posX + 1) < MAP_WIDTH && (this.map[posY][posX + 1] != 1)) {
                posX += 1;
            }
            break;
        case 'w': // East
            if ((posX - 1) < MAP_WIDTH && (this.map[posY][posX - 1] != 1)) {
                posX -= 1;
            }
            break;
        }

        this.memory[posY][posX] = 1;
    }

    var diffX = Math.abs(posX - this.endX);
    var diffY = Math.abs(posY - this.endY);

    return 1 / (diffX + diffY + 1);
};

// BobsMap end here

/*
 class Genome
*/
function Genome(numBits) {
    this.bits = [];
    this.fitness = 0;

    for (var i = 0; i < numBits; i++) {
        this.bits.push(Math.floor(Math.random() * 2));
    }
}

// Genome end here

/*
 class GaBob
*/
function GaBob(crossRat, mutRat, popSize, numBits, geneLen) {
    this.crossoverRate = crossRat;
    this.mutationRate = mutRat;
    this.popSize = popSize;
    this.chromoLength = numBits;
    this.totalFitnessScore = 0.0;
    this.generation = 0;
    this.geneLength = geneLen;
    this.busy = false;

    this.bobsBrain = null;
    this.bobsMap = new BobsMap();

    this.genomes = [];

    this.createStartPopulation();
}

GaBob.prototype.createStartPopulation = function () {
    this.genomes = [];
    for (var i = 0; i < this.popSize; i++) {
        this.genomes.push(new Genome(this.chromoLength));
    }

    this.generation = 0;
    this.fittestGenome = 0;
    this.bestFitnessScore = 0;
    this.totalFitnessScore = 0;
};

GaBob.prototype.run = function () {
    this.createStartPopulation();

    this.busy = true;
};

GaBob.prototype.rouletteWheelSelection = function () {
    var slice = Math.random() * this.totalFitnessScore;
    var total = 0.0;
    var selectedGenome = 0;

    for (var i = 0; i < this.popSize; i++) {
        total += this.genomes[i].fitness;
        if (total > slice) {
            selectedGenome = i;
            break;
        }
    }

    return this.genomes[selectedGenome];
};

GaBob.prototype.mutate = function (bits) {
    for (var curBit = 0; curBit < bits.length; curBit++) {
        if (Math.random() < this.mutationRate) {
            if (bits[curBit] === 0) {
                bits[curBit] = 1;
            } else {
                bits[curBit] = 0;
            }
        }
    }
};

GaBob.prototype.crossover = function (mum, dad, baby1, baby2) {
    var i;

    if (Math.random() > this.crossoverRate || mum == dad) {
        baby1.bits = mum.bits.slice(0);
        baby2.bits = dad.bits.slice(0);
        return;
    }

    // determine a crossover point
    var cp = Math.floor(Math.random() * this.chromoLength);

    baby1.bits = mum.bits.slice(0, cp).concat(dad.bits.slice(cp));
    baby2.bits = data.bits.slice(0, cp).concat(mum.bits.slice(cp));
};

GaBob.prototype.epoch = function () {
    this.updateFitnessScores();

    // Now to create a new population
    var newBabies = 0;
    var babyGenomes;

    while (newBabies < this.popSize) {
        var mum = this.rouletteWheelSelection();
        var dad = this.rouletteWheelSelection();

        var baby1 = new Genome();
        var baby2 = new Genome();

        this.crossover(mum, data, baby1, baby2);

        // operator - mutate
        this.mutate(baby1.bits);
        this.mutate(baby2.bits);

        newBabies += 2;
    }

    this.genomes = babyGenomes;
    this.generation++;
};

GaBob.prototype.updateFitnessScores = function () {
    this.fittestGenome = 0;
    this.bestFitnessScore = 0;
    this.totalFitnessScore = 0;

    var tmpMaps = new BobsMap();

    for (var i = 0; i < this.popSize; i++) {
        var gen = this.genomes[i];
        var path = this.decode(gen.bits);
        gen.fitness = this.bobsMap.TestRoute(path);

        this.totalFitnessScore += gen.fitness;

        if (gen.fitness > this.bestFitnessScore) {
            this.bestFitnessScore = gen.fitness;
            this.fittestGenome = i;
            this.bobsBrain = tmpMaps;

            if (gen.fitness === 1) {
                this.busy = false;
            }
        }

        tmpMaps.memory = tmpMaps.getCleanMemory();
    }  // next genome
};

GaBob.prototype.decode = function (bits) {
    var path = [];

    var dirs = "nsew"; // North, South, East, West

    for (var i = 0; i < bits.length; i+=this.geneLength) {
        var gene = bits.slice(i, this.geneLength);
        path.push(dirs[parseInt(gene, 2)]);
    }
    return path;
};

GaBob.prototype.render = function () {
    var start;
    this.bobsMap.render();
    this.bobsBrain.memoryRender();

    var s = "Generation: " + this.generation;

    if (!this.busy) {
        start = "Press Return to start a new run";
        console.log(start);
    } else {
        start = "Space to stop";
        console.log(start);
    }
};

GaBob.prototype.show = function () {
    this.bobsMap.show();
};

// GaBob end here