// Definindo a cena de boas-vindas usando a biblioteca Phaser
class GameScreen extends Phaser.Scene {

    // Declaração da variável
    plataformas;
    bigornas;
    livros;
    espinhos;
    fogos;
    listaNovosFogos = [];

    // Construtor da cena
    constructor() {
        super({
            key: 'GameScreen',
            backgroundColor: '#000', // Configuração da cor de fundo da cena
        });
    }

    // Inicialização de variáveis e configurações da cena
    init() {
        // 1) JOGADOR
        this.player = {
            width: 48,
            height: 80,
            obj: null // Objeto do jogador
        };

        // 2) CONTROLES DA RODADA
        this.gameControls = {
            over: false, // Flag para indicar se o jogo terminou
            score: 0, // Pontuação do jogador
            scoreText: "", // Texto exibindo a pontuação
            restartBt: null, // Botão de reinício
            cursors: null // Controles do teclado
        };
    }

    // Pré-carregamento de recursos
    preload() {
        // Carregamento de imagens e sprites necessários para o jogo
        this.load.image("fundo", "assets/fundo.jpg"); 
        this.load.image("livro", "assets/livro.png"); 
        this.load.image("plataforma", "assets/plataforma.png"); 
        this.load.image("bigorna", "assets/bigorna.png"); 
        this.load.image("espinho", "assets/espinho.png"); 
        this.load.image("restart", "assets/reset_bt.png"); 
        this.load.image("gameWin", "assets/gameWin.png"); 
        this.load.image("gameOver", "assets/gameOver.png"); 
        this.load.spritesheet("fogo", "assets/fogo.png", { frameWidth: 64 , frameHeight: 62 }); 
        this.load.spritesheet("eli", "assets/eli.png", { frameWidth: this.player.width, frameHeight: this.player.height }); 
    }

    // Função chamada quando a cena é criada
    create() {
        // Adição do fundo e configuração do jogador
        this.add.image(960, 442.5, 'fundo');
        this.player.obj = this.physics.add.sprite(384, 512, 'eli');

        // Configuração dos controles e do botão de reinício
        this.gameControls.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.gameControls.restartBt = this.add.image(875 , 575,
        'restart').setScale(0.05).setOrigin(0, 0).setInteractive().setVisible(false);

        // Lógica de reinício ao clicar no botão
        this.gameControls.restartBt.on('pointerdown', function () {
            if (this.gameControls.over) {
                this.gameControls.over = false;
                this.gameControls.score = 0;
                this.listaNovosFogos.length = 0;
                this.scene.restart();
            }
        }, this);

        // Configurações adicionais do jogador
        this.player.obj.body.setGravityY(300);
        this.player.obj.setBounce(0.2);
        this.player.obj.setCollideWorldBounds(true);
        
        // Criação das plataformas, itens e colisões
        this.plataformas = this.physics.add.staticGroup();
        this.espinhos = this.physics.add.staticGroup();
        this.fogos = this.physics.add.group();
        this.bigornas = this.physics.add.group();

        // Criação de plataformas
        Array(13).fill().map((_, index) => {
            this.plataformas.create(1920 - 155 * index, 865, "plataforma");
        });

        // Criação de plataformas e fogos
        Array(6).fill().map((_, index) => {
            let fogo;
            if(index % 2 != 0)
            {
                this.listaNovosFogos.push(this.fogos.create(1300 - 140 * index, 647, "fogo"));
                /*
                fogo = this.fogos.create(1300 - 140 * index, 647, "fogo");
                this.fogos.add(fogo)*/
            }
            this.plataformas.create(1300 - 155 * index, 700, 'plataforma');
        });

        // Criação de plataformas e espinhos
        Array(6).fill().map((_, index) => {
            index % 2 != 0 ? this.espinhos.create(1400 - 155 * index, 325, "espinho") : console.log("deu certo");
            
            index % 2 != 0 ? this.plataformas.create(1400 - 155 * index, 380, 'plataforma') : console.log("deu certo");
        });

        //this.fogos.create(1600, 485, "fogo");
        
        //Adição de barreiras
        this.listaNovosFogos.push(this.fogos.create(1600, 495, "fogo"));
        this.listaNovosFogos.forEach((fogo) => this.fogos.add(fogo));
        this.espinhos.create(300, 500, "espinho")

        // Criação de outras plataformas
        this.plataformas.create(1550, 555, 'plataforma');
        this.plataformas.create(1705, 555, 'plataforma');
        this.plataformas.create(1527.5, 245, 'plataforma');
        this.plataformas.create(1850, 400, 'plataforma');
        this.plataformas.create(155, 555, 'plataforma');
        this.plataformas.create(310, 555, 'plataforma');
        this.plataformas.create(252.5, 245, 'plataforma');
        this.plataformas.create(80, 400, 'plataforma');

        // Criação de grupo de bigornas
        this.physics.add.collider(this.bigornas, this.plataformas);
        this.physics.add.collider(this.fogos, this.plataformas);
        this.physics.add.collider(this.player.obj, this.bigornas, this.hitItem, null, this);
        this.physics.add.collider(this.player.obj, this.espinhos, this.hitItem, null, this);
        this.physics.add.collider(this.player.obj, this.fogos, this.hitItem, null, this);

        // Configuração das animações
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('eli', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
       
        this.anims.create({
            key: 'Up',
            frames: [{ key: 'eli', frame: 10 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'stop',
            frames: this.anims.generateFrameNumbers('eli', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('eli', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'fogo',
            frames: this.anims.generateFrameNumbers('fogo', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Criação de livros
        this.livros = this.physics.add.group({
            key: 'livro',
            repeat: 15,
            setXY: { x: 50, y: 0, stepX: 155 },
        });
        
        // Configuração do comportamento dos livros
        this.livros.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.8));
        });
      
        //Configuração do comportamento dos fogos
        this.fogos.children.iterate(function(fogo) {
            fogo.anims.play('fogo');
        });


        // Adição de colisores
        this.physics.add.collider(this.player.obj, this.espinhos);
        this.physics.add.collider(this.player.obj, this.fogos);
        this.physics.add.collider(this.player.obj, this.plataformas);
        this.physics.add.collider(this.livros, this.plataformas);

        // Configuração da lógica de coleta de livros
        this.physics.add.overlap(this.player.obj, this.livros, this.collectBook, null, this);
    }

    // Atualização contínua do jogo
    update() {
        // Lógica de movimentação e pulo do jogador
        this.gameControls.cursors = this.input.keyboard.createCursorKeys();

        if (this.gameControls.cursors.left.isDown && this.gameControls.cursors.up.isDown)
        {
            this.player.obj.setVelocityX(-160);
            
            this.player.obj.anims.play('leftUp', true);
        }
        else if (this.gameControls.cursors.right.isDown && this.gameControls.cursors.up.isDown)
        {
            this.player.obj.setVelocityX(160);
            
            this.player.obj.anims.play('rightUp', true);
        }
        else if (this.gameControls.cursors.left.isDown)
        {
            this.player.obj.setVelocityX(-160);

            this.player.obj.anims.play('left', true);
        }
        else if (this.gameControls.cursors.right.isDown)
        {
            this.player.obj.setVelocityX(160);

            this.player.obj.anims.play('right', true);
        }
        else
        {
            this.player.obj.setVelocityX(0);

            this.player.obj.anims.play('stop', true);
        }

        if (this.gameControls.cursors.up.isDown && this.player.obj.body.touching.down)
        {
            this.player.obj.setVelocityY(-500);
        }
    }

    // Função chamada ao coletar um livro
    collectBook (player, livro)
    {
        // Ação ao coletar um livro
        livro.disableBody(true, true);

        this.gameControls.score += 10;
        this.gameControls.scoreText.setText('Score: ' + this.gameControls.score);

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bigorna = this.bigornas.create(x, 16, 'bigorna');
        bigorna.setBounce(1);
        bigorna.setCollideWorldBounds(true);
        bigorna.setVelocity(Phaser.Math.Between(-200, 200), 20);

        if (this.livros.countActive(true) === 0)
        {
            this.gameWin();
        }
    }

    // Função chamada ao colidir com um item (dano)
    hitItem (player, item)
    {
        // Ação ao colidir com um item (dano)
        player.anims.play('stop');
        this.gameOver();
    }

    // Função chamada ao vencer o jogo  
    gameWin()
    {
        // Ação ao vencer o jogo
        this.physics.pause();
        this.gameControls.over = false;
        this.add.image(960, 500, 'gameWin').setScale(.25);
        this.gameControls.restartBt.visible = true;
        if (this.gameControls.score > this.game.highScore) {
            this.game.highScore = this.gameControls.score;
        }
    }

    // Função chamada ao perder o jogo
    gameOver()
    {
        // Ação ao perder o jogo
        this.physics.pause();
        this.player.obj.setTint(0xff0000);
        this.gameControls.over = true;
        this.add.image(960, 500, 'gameOver').setScale(.25);
        this.gameControls.restartBt.visible = true;
        if (this.gameControls.score > this.game.highScore) {
            this.game.highScore = this.gameControls.score;
        }
    }
}