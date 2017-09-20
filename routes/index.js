/**
 * Created by ibm on 2017/9/12.
 */
const path = require('path');
const express = require('express');
const router = express.Router();

const menu = [
    {
        firstMenu: './gailan',
        title: '概览',
        secMenu: [
            {
                url: './gailan',
                title: '站点(概览)'
            },
            {
                url: './center',
                title: '中心(概览)'
            }
        ],
        imgSrc: '../images/top/zdw.png',
    },
    {
        firstMenu: './siteManagement',
        title: '站点',
        secMenu: [
            {
                url: './site',
                title: '站点'
            },
            {
                url: './siteManagement',
                title: '站点管理'
            },
            {
                url: './siteMaintain',
                title: '站点维护'
            },
        ],
        imgSrc: '../images/top/zd05.png',
    },
    {
        firstMenu: './assetsManagement',
        title: '资产管理',
        secMenu: [
            {
                url: './assetsManagement',
                title: '总资产统计'
            },
            {
                url: './assetsManagement',
                title: '备品备件库'
            },
            {
                url: './assetsManagement',
                title: '报废库'
            },
        ],
        imgSrc: '../images/top/zcw.png',
    },
    {
        firstMenu: './operationRecord',
        title: '运维管理',
        secMenu: [
            {
                url: './taskList',
                title: '任务列表'
            },
            {
                url: './operationRecord',
                title: '运维记录'
            },
            {
                url: './flowSetting',
                title: '流程设置'
            },
        ],
        imgSrc: '../images/top/yww.png',
    },
    {
        firstMenu: './systemSettings',
        title: '系统设置',
        secMenu: [
            {
                url: './systemSettings',
                title: '行政区域设置'
            },
            {
                url: './siteTypeSettings',
                title: '站点类型设置'
            },
            {
                url: './roleSettings',
                title: '角色设置'
            },
            {
                url: './staffSettings',
                title: '人员设置'
            },
            {
                url: './qrCodeSettings',
                title: '二维码设置'
            },
            {
                url: './logSettings',
                title: '日志设置'
            },
            {
                url: './databaseSettings',
                title: '数据库设置'
            },
            {
                url: './buyersManagement',
                title: '买家管理'
            },
        ],
        imgSrc: '../images/top/xtszw.png',
    },
    {
        firstMenu: './knowledgeBase',
        title: '知识库',
        secMenu: [
            {
                url: './knowledgeBase',
                title: '知识库'
            },
        ],
        imgSrc: '../images/top/zskw.png',
    },
    {
        firstMenu: './report',
        title: '统计报表',
        secMenu: [
            {
                url: './tjgailan',
                title: '概览'
            },
            {
                url: './report',
                title: '站点统计'
            },
            {
                url: './workInformation',
                title: '工况信息'
            },
            {
                url: './staffInformation',
                title: '人员'
            },
            {
                url: './scoreInformation',
                title: '考核统计'
            }
        ],
        imgSrc: '../images/top/tjbbw.png',
    },
    {
        firstMenu: './weChatManagement',
        title: '微信管理',
        secMenu: [
            {
                url: './weChatManagement',
                title: '防汛信息'
            },
            {
                url: './floodPropaganda',
                title: '防汛宣传'
            }
        ],
        imgSrc: '../images/top/wxglw.png',
    },
    {
        firstMenu: './scoreManagement',
        title: '管理评分',
        secMenu: [
            {
                url: './scoreManagement',
                title: '管理评分'
            },
            {
                url: './examineScore',
                title: '审核评分'
            }
        ],
        imgSrc: '../images/top/pfglw.png',
    },
];


// 路由：用于指定不同的访问路所对应的回调函数
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/html', 'game.html'))
});



router.get('/siteManagement', (req, res) => {
    console.log('进入站点管理界面')
    res.render('siteManagement', {
        menus: menu,
        curMenu: './siteManagement',
        curPage: './siteManagement'
    })
})

router.get('/random/:min/:max', (req, res) => {
    console.log(req.params)
    let min = parseInt(req.params.min)
    let max = parseInt(req.params.max)

    if(isNaN(min) || isNaN(max)) {
        res.status(400);
        res.json({
            error: 'bad request'
        });
        return;
    }

    let result = Math.round(Math.random() * (max -min) + min)

    res.json({
        result: result
    })
    
})


module.exports = router;
