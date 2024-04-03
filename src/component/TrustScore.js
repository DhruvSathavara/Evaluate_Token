
const calculateTrustScore = (maxSupply, totalSupply, circulatingSupply, topHolders, isBugInContract, setTopHoldersPercenage) => {
    var score = 0;

    console.log('params--', maxSupply, totalSupply, circulatingSupply, topHolders, isBugInContract);


    const circulatingRatio = circulatingSupply / totalSupply;

    if (circulatingRatio > 0.8) {
        score += 20;
    } else if (circulatingRatio >= 0.6) {
        score += 15 * circulatingRatio;
    }
    else if (circulatingRatio >= 0.4) {
        score += 10 * circulatingRatio;
    }
    else {
        score += 5 * circulatingRatio;
    }

    console.log('score after cir ration', score);

    let topHoldersPercentage = 0;
    topHolders.forEach(holder => {
        topHoldersPercentage += (holder.amount / totalSupply) * 100;
    });
    setTopHoldersPercenage(Math.round(topHoldersPercentage));


    if (topHoldersPercentage < 1) {
        score += 40
    } else if (topHoldersPercentage > 1 && topHoldersPercentage < 5) {
        score += 30;
    } else if (topHoldersPercentage > 5 && topHoldersPercentage < 10) {
        score += 20;
    } else if (topHoldersPercentage > 10 && topHoldersPercentage < 15) {
        score += 10;
    } else {
        score += 0;
    }

    console.log('score after top holder', score);

    if (maxSupply !== null) {
        const supplyDifference = maxSupply - totalSupply;

        const differencePercentage = supplyDifference / maxSupply;

        if (differencePercentage < 0.1) {
            score += 20;
        } else if (differencePercentage < 0.2) {
            score += 15;
        } else if (differencePercentage < 0.3) {
            score += 10;
        } else if (differencePercentage < 0.4) {
            score += 5;
        } else {
            score += 0;
        }
    }
    console.log('score after diff in', score);


    if (isBugInContract === 'NO') {
        score += 20;
    }



    console.log('log final score', score);
    const percenAgeScore = Math.round(score * 100 / 100);

    return Number(percenAgeScore);
}

export default calculateTrustScore;
