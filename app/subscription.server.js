import prisma  from "./db.server";

function validateSubscriptionData(subscriptionDetails) {
  console.log("Validating subscription data:", subscriptionDetails);

  if (!subscriptionDetails) {
    throw new Error("Subscription details are required");
  }

  const { planName, currentPeriodEnd, id } = subscriptionDetails;

  if (!planName) {
    console.error("Missing plan name in:", subscriptionDetails);
    throw new Error("Plan name is required");
  }

  // Validate and parse the current period end date
  let validCurrentPeriod;
  if (currentPeriodEnd) {
    validCurrentPeriod = new Date(currentPeriodEnd);
    if (isNaN(validCurrentPeriod.getTime())) {
      console.error("Invalid currentPeriodEnd:", currentPeriodEnd);
      validCurrentPeriod = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  } else {
    validCurrentPeriod = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }


  const validatedData = {
    id,
    planName,
    currentPeriod: validCurrentPeriod,
  };

  console.log("Validated subscription data:", validatedData);
  return validatedData;
}

export async function updateSubscription({ session, subscriptionDetails }) {
  try {
    console.log("Starting subscription update for shop:", session.shop);
    
    // Validate the subscription data
    const validatedData = validateSubscriptionData(subscriptionDetails);

    // Update or create shop record
    const shop = await prisma.shop.upsert({
      where: {
        shopDomain: session.shop,
      },
      create: {
        shopDomain: session.shop,
        accessToken: session.accessToken,
        planName: validatedData.planName,
      },
      update: {
        planName: validatedData.planName,
        accessToken: session.accessToken,
      },
    });

    console.log("Shop record updated:", shop);

    // Create new subscription record
    const subscription = await prisma.subscription.create({
      data: {
        id:validatedData.id,
        shopId: shop.id,
        planName: validatedData.planName,
        status: "ACTIVE",
        currentPeriod: validatedData.currentPeriod,
        trialEnd: validatedData.trialEnd,
      },
    });

    console.log("Subscription record created:", subscription);

    return { success: true};
  } catch (error) {
    console.error("Error in updateSubscription:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSubscriptionStatus(subscriptionId){
    try {
        await prisma.subscription.update({
            where: { id: subscriptionId },
            data: { status: "INACTIVE" },
        });
    }catch(error){
        console.error("Error in updateSubscription:", error);
        return { success: false, error: error.message };
    }
}