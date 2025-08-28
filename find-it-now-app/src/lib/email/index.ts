// Export all email functions from their respective modules
export {
  sendApprovalEmail,
  sendRejectionEmail,
  sendRevertEmail,
} from "./institution";
export { sendLostItemReportConfirmationEmail } from "./lostItemReport";
export {
  sendPickupRequestApprovalEmail,
  sendPickupRequestRejectionEmail,
} from "./pickupRequest";
