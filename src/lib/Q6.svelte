<script lang="ts">
    let optDispatchingFrequencyA: number = $state(0);
    let optDispatchingFrequencyB: number = $state(0);

    let productionRateA: number = $state(1_000);
    let productionRateB: number = $state(3_000);

    let FridgeRevenuePerTruckload: number = $state(200_000);
    let StereoRevenuePerTruckload: number = $state(2_000_000);

    let InventoryCarryingCostPerYearPercent: number = $state(0.15);

    let distanceAC: number = $state(300);
    let distanceBC: number = $state(300);

    let transportationCostPerMile: number = $state(1);

    let optDispatchingSizeA: number = $state(0);
    let optDispatchingSizeB: number = $state(0);

    let costPerDayA: number = $state(0);
    let costPerDayB: number = $state(0);
</script>

a
